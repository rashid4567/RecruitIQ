import {
  RecruiterSubscription,
  RecruiterSubscriptionProps,
} from "../../domain/entities/recruiter-subscription.entity";
import { RecruiterSubscriptionRepository } from "../../domain/repository/recruiter-subscription-plan-repository";
import {
  RecruiterSubscriptionModel,
  IRecruiterSubscription,
} from "../mongoose/Recruitersubscription.model";

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
      status: "active",
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
      planType: doc.planType as any,
      paymentReferenceId: doc.paymentReferenceId,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      currentPeriodStart: doc.currentPeriodStart,
      currentPeriodEnd: doc.currentPeriodEnd,
      autoRenew: doc.autoRenew,
      cancelledAt: doc.cancelledAt,
      jobPostsUsed: doc.jobPostsUsed,
      screeningUsed: doc.screeningUsed,
      resumeUsed: doc.resumeUsed,
      aiScoreUsed: doc.aiScoreUsed,
      jobPostsLimit: doc.jobPostsLimit,
      screeningLimit: doc.screeningLimit,
      resumeLimit: doc.resumeLimit,
      aiScoreLimit: doc.aiScoreLimit,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    return RecruiterSubscription.create(props);
  }
}
