import mongoose, { Types } from "mongoose";
import {
  CancelInput,
  ChangePlanInput,
  PaginatedResult,
  PaginationOptions,
  RecruiterSubscriptionRepository,
  RenewInput,
  SubscribeInput,
  UsageUpdateInput,
} from "../../domain/repositories/recruiter-subscription.repository";
import {
  CancellationReason,
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../domain/entities/Recruitersubscription.entity";
import {
  IRecruiterSubscription,
  RecruiterSubscriptionModel,
} from "../mongoose/model/Recruitersubscription.model";

export class MongooseRecruiterSubscriptionRepository implements RecruiterSubscriptionRepository {
  private assertObjectId(id: string, field = "id") {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ${field}`);
    }
  }

  private safePage(p?: number) {
    return Math.max(1, p ?? 1);
  }

  private safeLimit(l?: number) {
    return Math.min(50, Math.max(1, l ?? 10));
  }

  async findById(id: string): Promise<RecruiterSubscription | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await RecruiterSubscriptionModel.findById(id);

    return doc ? this.toEntity(doc) : null;
  }

  async findActiveByRecruiterId(
    recruiterId: string,
  ): Promise<RecruiterSubscription | null> {
    if (!Types.ObjectId.isValid(recruiterId)) {
      return null;
    }

    const doc = await RecruiterSubscriptionModel.findOne({
      recruiterId: new Types.ObjectId(recruiterId),

      status: {
        $in: [SubscriptionStatus.Active, SubscriptionStatus.Trialing],
      },
    }).sort({ createdAt: -1 });

    return doc ? this.toEntity(doc) : null;
  }

  async findAllByRecruiterId(
    recruiterId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<RecruiterSubscription>> {
    this.assertObjectId(recruiterId, "recruiterId");
    const page = this.safePage(pagination?.page);
    const limit = this.safeLimit(pagination?.limit);
    const skip = (page - 1) * limit;
    const filter = {
      recruiterId: new Types.ObjectId(recruiterId),
    };

    const [docs, total] = await Promise.all([
      RecruiterSubscriptionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      RecruiterSubscriptionModel.countDocuments(filter),
    ]);

    return {
      data: docs.map((d) => this.toEntity(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByRazorpayOrderId(
    razorpayOrderId: string,
  ): Promise<RecruiterSubscription | null> {
    const doc = await RecruiterSubscriptionModel.findOne({
      razorpayOrderId,
    });

    return doc ? this.toEntity(doc) : null;
  }

  async findByStatus(
    status: SubscriptionStatus,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<RecruiterSubscription>> {
    const page = this.safePage(pagination?.page);

    const limit = this.safeLimit(pagination?.limit);

    const skip = (page - 1) * limit;

    const filter = { status };

    const [docs, total] = await Promise.all([
      RecruiterSubscriptionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      RecruiterSubscriptionModel.countDocuments(filter),
    ]);

    return {
      data: docs.map((d) => this.toEntity(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findExpiredActive(): Promise<RecruiterSubscription[]> {
    const docs = await RecruiterSubscriptionModel.find({
      status: { $in: [SubscriptionStatus.Active, SubscriptionStatus.Trialing] },
      endDate: { $lte: new Date() },
    });

    return docs.map((doc) => this.toEntity(doc));
  }

  async findExpiringWithin(days: number): Promise<RecruiterSubscription[]> {
    const now = new Date();

    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const docs = await RecruiterSubscriptionModel.find({
      status: SubscriptionStatus.Active,

      endDate: {
        $gte: now,
        $lte: cutoff,
      },
    });

    return docs.map((doc) => this.toEntity(doc));
  }

  async create(input: SubscribeInput): Promise<RecruiterSubscription> {
    this.assertObjectId(input.recruiterId, "recruiterId");
    this.assertObjectId(input.planId, "planId");

    const doc = await RecruiterSubscriptionModel.create({
      recruiterId: new Types.ObjectId(input.recruiterId),
      planId: new Types.ObjectId(input.planId),
      planName: input.planName,
      planType: input.planType,
      price: input.price,
      currency: input.currency,
      billingCycle: input.billingCycle,
      jobPostsLimit: input.jobPostsLimit,
      screeningCreditsLimit: input.screeningCreditsLimit,
      jobPostsUsed: 0,
      screeningCreditsUsed: 0,
      startDate: input.startDate,
      endDate: input.endDate,
      currentPeriodStart: input.startDate,
      currentPeriodEnd: input.endDate,
      renewsAt: input.renewsAt,
      autoRenew: input.autoRenew,
      status: input.status,
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpayCustomerId: input.razorpayCustomerId,
    });

    return this.toEntity(doc);
  }

  async cancel(input: CancelInput): Promise<RecruiterSubscription> {
    this.assertObjectId(input.subscriptionId, "subscriptionId");

    const update: Record<string, unknown> = {
      cancelledAt: input.cancelledAt,
      cancellationReason: input.reason,
      cancellationNote: input.note,
      autoRenew: false,
    };

    if (!input.cancelAtPeriodEnd) {
      update.status = SubscriptionStatus.Cancelled;
    }

    const doc = await RecruiterSubscriptionModel.findByIdAndUpdate(
      input.subscriptionId,
      { $set: update },
      { new: true },
    );

    if (!doc) {
      throw new Error("Subscription not found");
    }
    return this.toEntity(doc);
  }

  async changePlan(input: ChangePlanInput): Promise<RecruiterSubscription> {
    this.assertObjectId(input.subscriptionId, "subscriptionId");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const old = await RecruiterSubscriptionModel.findById(
        input.subscriptionId,
      ).session(session);

      if (!old) {
        throw new Error("Subscription not found");
      }

      await RecruiterSubscriptionModel.findByIdAndUpdate(
        input.subscriptionId,
        {
          $set: {
            status: SubscriptionStatus.Cancelled,
            cancelledAt: new Date(),
            cancellationReason: input.changeReason,
            autoRenew: false,
          },
        },
        { session },
      );

      const now = new Date();

      const newSub = await RecruiterSubscriptionModel.create(
        [
          {
            recruiterId: old.recruiterId,
            planId: new Types.ObjectId(input.newPlanId),
            planName: input.newPlanName,
            planType: input.newPlanType,
            price: input.newPrice,
            currency: input.newCurrency,
            billingCycle: input.newBillingCycle,
            jobPostsLimit: input.newJobPostsLimit,
            screeningCreditsLimit: input.newScreeningCreditsLimit,
            jobPostsUsed: 0,
            screeningCreditsUsed: 0,
            startDate: now,
            endDate: input.newEndDate,
            currentPeriodStart: now,
            currentPeriodEnd: input.newEndDate,
            autoRenew: false,
            status: SubscriptionStatus.Active,
          },
        ],
        { session },
      );

      await session.commitTransaction();

      session.endSession();

      return this.toEntity(newSub[0]);
    } catch (err) {
      await session.abortTransaction();

      session.endSession();

      throw err;
    }
  }

  async renew(input: RenewInput): Promise<RecruiterSubscription> {
    this.assertObjectId(input.subscriptionId, "subscriptionId");

    const doc = await RecruiterSubscriptionModel.findByIdAndUpdate(
      input.subscriptionId,
      {
        $set: {
          status: SubscriptionStatus.Active,
          startDate: input.newStartDate,
          endDate: input.newEndDate,
          currentPeriodStart: input.newStartDate,
          currentPeriodEnd: input.newEndDate,
          renewsAt: input.newRenewsAt,
        },

        $unset: {
          cancelledAt: "",
          cancellationReason: "",
          cancellationNote: "",
        },
      },
      { new: true },
    );

    if (!doc) {
      throw new Error("Subscription not found");
    }

    return this.toEntity(doc);
  }

  async updateUsage(input: UsageUpdateInput): Promise<RecruiterSubscription> {
    this.assertObjectId(input.subscriptionId, "subscriptionId");

    const inc: Record<string, number> = {};

    if (input.jobPostsDelta !== undefined) {
      inc.jobPostsUsed = input.jobPostsDelta;
    }

    if (input.screeningCreditsDelta !== undefined) {
      inc.screeningCreditsUsed = input.screeningCreditsDelta;
    }

    const doc = await RecruiterSubscriptionModel.findOneAndUpdate(
      {
        _id: input.subscriptionId,

        jobPostsUsed: { $gte: 0 },

        screeningCreditsUsed: {
          $gte: 0,
        },
      },

      { $inc: inc },

      { new: true },
    );

    if (!doc) {
      throw new Error("Subscription not found or invalid update");
    }

    return this.toEntity(doc);
  }

  async updateStatus(
    subscriptionId: string,
    status: SubscriptionStatus,
  ): Promise<RecruiterSubscription> {
    this.assertObjectId(subscriptionId, "subscriptionId");

    const doc = await RecruiterSubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { $set: { status } },
      { new: true },
    );

    if (!doc) {
      throw new Error("Subscription not found");
    }

    return this.toEntity(doc);
  }

  async resetPeriodUsage(
    subscriptionId: string,
    newPeriodStart: Date,
    newPeriodEnd: Date,
  ): Promise<RecruiterSubscription> {
    this.assertObjectId(subscriptionId, "subscriptionId");

    const doc = await RecruiterSubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      {
        $set: {
          jobPostsUsed: 0,
          screeningCreditsUsed: 0,
          currentPeriodStart: newPeriodStart,
          currentPeriodEnd: newPeriodEnd,
        },
      },
      { new: true },
    );

    if (!doc) {
      throw new Error("Subscription not found");
    }

    return this.toEntity(doc);
  }

  private toEntity(doc: IRecruiterSubscription): RecruiterSubscription {
    return RecruiterSubscription.create({
      id: (doc._id as Types.ObjectId).toString(),
      recruiterId: doc.recruiterId.toString(),
      planId: doc.planId.toString(),
      planName: doc.planName,
      planType: doc.planType,
      price: doc.price,
      currency: doc.currency,
      billingCycle: doc.billingCycle,
      razorpayOrderId: doc.razorpayOrderId,
      razorpayPaymentId: doc.razorpayPaymentId,
      razorpayCustomerId: doc.razorpayCustomerId,
      status: doc.status as SubscriptionStatus,
      startDate: doc.startDate,
      endDate: doc.endDate,
      trialEndDate: doc.trialEndDate,
      cancelledAt: doc.cancelledAt,
      cancellationReason: doc.cancellationReason as
        | CancellationReason
        | undefined,
      cancellationNote: doc.cancellationNote,
      renewsAt: doc.renewsAt,
      autoRenew: doc.autoRenew,
      jobPostsUsed: doc.jobPostsUsed,
      screeningCreditsUsed: doc.screeningCreditsUsed,
      jobPostsLimit: doc.jobPostsLimit,
      screeningCreditsLimit: doc.screeningCreditsLimit,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
