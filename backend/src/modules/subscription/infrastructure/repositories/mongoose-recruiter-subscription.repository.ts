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
  async save(subscription: RecruiterSubscription) {
    await RecruiterSubscriptionModel.create(subscription.toObject());
  }

  async update(subscription: RecruiterSubscription) {
    await RecruiterSubscriptionModel.findByIdAndUpdate(
      subscription.id,

      {
        $set: subscription.toObject(),
      },
    );
  }

  async findById(id: string) {
    const doc = await RecruiterSubscriptionModel.findById(id);
    if (!doc) {
      return null;
    }
    return this.toEntity(doc);
  }

  async findActiveByRecruiter(recruiterId: string) {
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
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      autoRenew: doc.autoRenew,
      cancelledAt: doc.cancelledAt,
      jobPostsUsed: doc.jobPostsUsed,
      screeningUsed: doc.screeningUsed,
      resumeUsed: doc.resumeUsed,
      aiScoreUsed: doc.aiScoreUsed,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return RecruiterSubscription.create(props);
  }
}
