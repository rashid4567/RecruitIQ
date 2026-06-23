import {
  SubscriptionPlan,
  SubscriptionPlanProps,
  PlanType,
} from "../../domain/entities/subscription-plan.entity";

import { SubscriptionPlanFilter } from "../../domain/repository/subscription-plan.repository";
import { SubscriptionPlanRepository } from "../../domain/repository/subscription-plan.repository";

import {
  SubscriptionPlanModel,
  ISubscriptionPlan,
} from "../mongoose/subscriptionPlan.model";

export class MongooseSubscriptionPlanRepository implements SubscriptionPlanRepository {
  async save(plan: SubscriptionPlan): Promise<void> {
    await SubscriptionPlanModel.create(plan.toPlainObject());
  }
  async update(plan: SubscriptionPlan): Promise<void> {
    await SubscriptionPlanModel.findByIdAndUpdate(plan.id, {
      $set: plan.toPlainObject(),
    });
  }
  async delete(id: string): Promise<void> {
    await SubscriptionPlanModel.findByIdAndDelete(id);
  }
  async findById(id: string): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findById(id);
    if (!doc) {
      return null;
    }

    return this.toEntity(doc);
  }
  async findByPlanType(type: PlanType): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOne({
      planType: type,
    });

    if (!doc) {
      return null;
    }

    return this.toEntity(doc);
  }

  async findAll(filter: SubscriptionPlanFilter) {
    const query: Record<string, unknown> = {};
    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }
    if (filter.planType) {
      query.planType = filter.planType;
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      SubscriptionPlanModel.find(query)
        .sort({
          sortOrder: 1,
        })
        .skip(skip)
        .limit(limit),

      SubscriptionPlanModel.countDocuments(query),
    ]);

    return {
      data: docs.map((x) => this.toEntity(x)),
      total,
    };
  }

  private toEntity(doc: ISubscriptionPlan): SubscriptionPlan {
    const props: SubscriptionPlanProps = {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      planType: doc.planType,
      price: doc.price,
      currency: doc.currency,
      billingCycle: doc.billingCycle,
      jobPostActiveDays : doc.jobPostActiveDays,
      billingInterval: doc.billingInterval,
      jobPostsPerMonth: doc.jobPostsPerMonth,
      ResumeDownload : doc.ResumeDownload,
      screeningCredits: doc.screeningCredits,
      aiScoreCredits: doc.aiScoreCredits,
      featuresAccess: {
        interviewScheduling: doc.featuresAccess.interviewScheduling,
        advancedAnalytics: doc.featuresAccess.advancedAnalytics,
        prioritySupport: doc.featuresAccess.prioritySupport,
        resumeParsing : doc.featuresAccess.resumeParsing,
        aiResumeScoring: doc.featuresAccess.aiResumeScoring,
        candidateShortlisting: doc.featuresAccess.candidateShortlisting,
        exportReports: doc.featuresAccess.exportReports,
      },
      features: doc.features,
      isPopular: doc.isPopular,
      sortOrder: doc.sortOrder,
      isActive: doc.isActive,
      razorpayPlanId: doc.razorpayPlanId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return SubscriptionPlan.create(props);
  }
}
