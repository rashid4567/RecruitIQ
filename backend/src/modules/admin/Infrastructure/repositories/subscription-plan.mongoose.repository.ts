import {
  SubscriptionPlan,
  SubscriptionPlanProps,
  PlanType,
} from "../../Domain/entities/subscription-plan.entity";
import {
  SubscriptionPlanFilter,
  SubscriptionPlanRepository,
} from "../../Domain/repositories/subscription-plan.repository";
import {
  ISubscriptionPlan,
  SubscriptionPlanModel,
} from "../../../subscription/infrastructure/mongoose/subscriptionPlan.model";
import { Document } from "mongoose";
import { DomainError } from "../../../../shared/errors/domain.error";
import { ERROR_CODES } from "../../Application/constants/errorcode.constants";

type SubscriptionPlanDocument = ISubscriptionPlan & Document;

export class MongooseSubscriptionPlanRepository implements SubscriptionPlanRepository {
  async findAll(
    filter: SubscriptionPlanFilter,
  ): Promise<{ data: SubscriptionPlan[]; total: number }> {
    const query: Partial<Record<string, unknown>> = {};

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    }
    if (filter.planType !== undefined) {
      query.planType = filter.planType;
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      SubscriptionPlanModel.find(query)
        .sort({ sortOrder: 1 })
        .skip(skip)
        .limit(limit),
      SubscriptionPlanModel.countDocuments(query),
    ]);

    return {
      data: docs.map((doc) => this.toEntity(doc)),
      total,
    };
  }

  async findById(planId: string): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findById(planId);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOne({ planType });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByRazorpayPlanId(
    razorpayPlanId: string,
  ): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOne({ razorpayPlanId });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const doc = await SubscriptionPlanModel.create({
      name: plan.getName(),
      planType: plan.getPlanType(),
      price: plan.getPrice(),
      currency: plan.getCurrency(),
      billingCycle: plan.getBillingCycle(),
      billingInterval: plan.billingInterval,
      jobPostsPerMonth: plan.jobPostsPerMonth,
      screeningCredits: plan.screeningCredits,
      featuresAccess: {
        interviewScheduling: plan.featuresAccess.interviewScheduling,
        advancedAnalytics: plan.featuresAccess.advancedAnalytics,
        prioritySupport: plan.featuresAccess.prioritySupport,
      },
      features: plan.features.map((f) => ({
        name: f.name,
        included: f.included,
      })),
      isPopular: plan.isPopular,
      sortOrder: plan.sortOrder,
      isActive: plan.isActive,
      description: plan.getDescription(),
      razorpayPlanId: plan.getRazorpayPlanId(),
    });

    return this.toEntity(doc);
  }

  async update(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const doc = await SubscriptionPlanModel.findByIdAndUpdate(
      plan.getId(),
      {
        $set: {
          name: plan.getName(),
          price: plan.getPrice(),
          currency: plan.getCurrency(),
          billingCycle: plan.getBillingCycle(),
          billingInterval: plan.billingInterval,
          jobPostsPerMonth: plan.jobPostsPerMonth,
          screeningCredits: plan.screeningCredits,
          featuresAccess: {
            interviewScheduling: plan.featuresAccess.interviewScheduling,
            advancedAnalytics: plan.featuresAccess.advancedAnalytics,
            prioritySupport: plan.featuresAccess.prioritySupport,
          },
          features: plan.features.map((f) => ({
            name: f.name,
            included: f.included,
          })),
          isPopular: plan.isPopular,
          sortOrder: plan.sortOrder,
          description: plan.getDescription(),
          razorpayPlanId: plan.getRazorpayPlanId(),
        },
      },
      { new: true },
    );

    if (!doc) {
      throw new DomainError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    return this.toEntity(doc);
  }

  async setActive(planId: string, isActive: boolean): Promise<void> {
    const doc = await SubscriptionPlanModel.findByIdAndUpdate(
      planId,
      { $set: { isActive } },
      { new: true },
    );

    if (!doc) {
      throw new DomainError(ERROR_CODES.PLAN_NOT_FOUND);
    }
  }

  private toEntity(doc: SubscriptionPlanDocument): SubscriptionPlan {
    const props: SubscriptionPlanProps = {
      id: doc._id.toString(),
      name: doc.name,
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
      description: doc.description,
      razorpayPlanId: doc.razorpayPlanId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    return SubscriptionPlan.fromPersistence(props);
  }
}
