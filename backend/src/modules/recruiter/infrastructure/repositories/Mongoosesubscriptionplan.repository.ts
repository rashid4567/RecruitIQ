import { Types } from "mongoose";

import {
  PlanType,
  SubscriptionPlan,
} from "../../domain/entities/Subscriptionplan.entity";
import {
  PlanFilterOptions,
  SubscriptionPlanRepository,
} from "../../domain/repositories/Subscription.repository";
import {
  ISubscriptionPlan,
  SubscriptionPlanModel,
} from "../../../subscription/infrastructure/mongoose/subscriptionPlan.model";

export class MongooseSubscriptionPlanRepository implements SubscriptionPlanRepository {
  async findById(id: string): Promise<SubscriptionPlan | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await SubscriptionPlanModel.findById(id);

    return doc ? this.toEntity(doc) : null;
  }

  async findAll(filters?: PlanFilterOptions): Promise<SubscriptionPlan[]> {
    const query: Record<string, unknown> = {
      name: {
        $exists: true,
        $type: "string",
        $ne: "",
      },

      planType: {
        $exists: true,
        $ne: null,
      },
    };

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.planType) {
      query.planType = filters.planType;
    }

    if (filters?.currency) {
      query.currency = filters.currency;
    }

    const docs = await SubscriptionPlanModel.find(query).sort({ sortOrder: 1 });

    return docs.map((doc) => this.toEntity(doc));
  }

  async findActivePlans(): Promise<SubscriptionPlan[]> {
    const docs = await SubscriptionPlanModel.find({
      isActive: true,

      name: {
        $exists: true,
        $type: "string",
        $ne: "",
      },

      planType: {
        $exists: true,
        $ne: null,
      },
    }).sort({ sortOrder: 1 });

    return docs.map((doc) => this.toEntity(doc));
  }

  async findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOne({
      planType,
      isActive: true,
      name: {
        $exists: true,
        $type: "string",
        $ne: "",
      },
    });

    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: ISubscriptionPlan): SubscriptionPlan {
    return SubscriptionPlan.create({
      id: (doc._id as Types.ObjectId).toString(),
      name: doc.name,
      description: doc.description,
      planType: doc.planType,
      price: doc.price,
      currency: doc.currency,
      billingCycle: doc.billingCycle,
      billingInterval: doc.billingInterval,
      jobPostsPerMonth: doc.jobPostsPerMonth,
      screeningCredits: doc.screeningCredits,
      featuresAccess: {
        interviewScheduling: doc.featuresAccess.interviewScheduling,
        advancedAnalytics: doc.featuresAccess.advancedAnalytics,
        prioritySupport: doc.featuresAccess.prioritySupport,
      },

      features: doc.features.map((f) => ({
        name: f.name,
        included: f.included,
      })),
      isPopular: doc.isPopular,
      sortOrder: doc.sortOrder,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
