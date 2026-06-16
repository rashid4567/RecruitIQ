import { FilterQuery, Types } from "mongoose";
import { RecruiterProfileModel } from "../../../recruiter/infrastructure/mongoose/model/recruiter-profile.model";
import {
  RecruiterSubscription,
  RecruiterSubscriptionProps,
} from "../../domain/entities/recruiter-subscription.entity";
import {
  GetSubscribersParams,
  PaginatedSubscribers,
  RecruiterSubscriptionRepository,
} from "../../domain/repository/recruiter-subscription-plan-repository";
import {
  RecruiterSubscriptionModel,
  IRecruiterSubscription,
  SubscriptionStatus,
} from "../mongoose/Recruitersubscription.model";
import { PlanType } from "../mongoose/subscriptionPlan.model";
type PopulatedUser = {
  fullName: string;
  email: string;
};
type RecruiterProfileLean = {
  companyName?: string;
  userId?: Types.ObjectId | PopulatedUser;
};
export class MongooseRecruiterSubscriptionRepository implements RecruiterSubscriptionRepository {
  async save(
    subscription: RecruiterSubscription,
  ): Promise<RecruiterSubscription> {
    const doc = await RecruiterSubscriptionModel.create(
      subscription.toObject(),
    );
    return this.toEntity(doc);
  }
  async update(subscription: RecruiterSubscription): Promise<void> {
    await RecruiterSubscriptionModel.findByIdAndUpdate(
      subscription.id,
      {
        $set: subscription.toObject(),
      },
      {
        new: true,
      },
    );
  }

  async findAll(params: GetSubscribersParams): Promise<PaginatedSubscribers> {
    const { page = 1, limit = 10, search, status } = params;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<IRecruiterSubscription> = {};
    if (status) {
      filter.status = status as SubscriptionStatus;
    }
    if (search) {
      filter.$or = [
        {
          planName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          planType: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [subscriptions, total] = await Promise.all([
      RecruiterSubscriptionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RecruiterSubscriptionModel.countDocuments(filter),
    ]);

    const items = await Promise.all(
      subscriptions.map(async (sub) => {
        const recruiterProfile = await RecruiterProfileModel.findOne({
          userId: sub.recruiterId,
        })
          .populate({
            path: "userId",
            model: "User",
            select: "fullName email",
          })
          .lean<RecruiterProfileLean>();
        const user =
          recruiterProfile?.userId &&
          typeof recruiterProfile.userId === "object" &&
          "fullName" in recruiterProfile.userId
            ? recruiterProfile.userId
            : undefined;
        return {
          id: sub._id.toString(),
          recruiterId: sub.recruiterId?.toString() ?? "",
          recruiterName: user?.fullName ?? "Unknown",
          companyName: recruiterProfile?.companyName ?? "",
          planName: sub.planName,
          status: sub.status,
          startDate: sub.startDate,
          endDate: sub.endDate,
        };
      }),
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<RecruiterSubscription | null> {
    const doc = await RecruiterSubscriptionModel.findById(id);
    if (!doc) {
      return null;
    }
    return this.toEntity(doc);
  }
  async findActiveByRecruiter(
    recruiterId: string,
  ): Promise<RecruiterSubscription | null> {
    const doc = await RecruiterSubscriptionModel.findOne({
      recruiterId,
      status: SubscriptionStatus.Active,
    });

    if (!doc) {
      return null;
    }

    return this.toEntity(doc);
  }

  private toEntity(doc: IRecruiterSubscription): RecruiterSubscription {
    const props: RecruiterSubscriptionProps = {
      id: doc._id.toString(),
      recruiterId: doc.recruiterId.toString(),
      planId: doc.planId.toString(),
      planName: doc.planName,
      planPrice: doc.planPrice,
      planType: doc.planType as PlanType,
      jobPostActiveDays: doc.jobPostActiveDays,
      paymentReferenceId: doc.paymentReferenceId,
      status: doc.status,
      durationMonths: doc.durationMonths,
      startDate: doc.startDate,
      endDate: doc.endDate,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
      autoRenew: doc.autoRenew,
      cancelledAt: doc.cancelledAt,
      jobPostsUsed: doc.jobPostsUsed,
      screeningUsed: doc.screeningUsed,
      aiScoreUsed: doc.aiScoreUsed,
      jobPostsLimit: doc.jobPostsLimit,
      screeningLimit: doc.screeningLimit,
      aiScoreLimit: doc.aiScoreLimit,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    return RecruiterSubscription.create(props);
  }
}
