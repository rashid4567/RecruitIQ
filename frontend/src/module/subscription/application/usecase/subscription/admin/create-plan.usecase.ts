import { v4 as uuidv4 } from "uuid";

import type { CreatePlanPayload } from "../../../dto/subscription.plan.dto"; 
import type { AdminSubscriptionPlanRepository } from "@/module/subscription/domain/repositories/admin-subscription-plan.repository";
import { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";

export class CreatePlanUseCase {
  private readonly subscriptionRepo: AdminSubscriptionPlanRepository;
  constructor(subscriptionRepo: AdminSubscriptionPlanRepository) {
    this.subscriptionRepo = subscriptionRepo;
  }

  async execute(payload: CreatePlanPayload): Promise<SubscriptionPlan> {
    if (!payload.name?.trim()) {
      throw new Error("Plan name is required");
    }

    const existing = await this.subscriptionRepo.getPlanByType(
      payload.planType,
    );

    if (existing) {
      throw new Error("A plan with this type already exists");
    }

    const now = new Date();

    const plan = SubscriptionPlan.create({
      id: uuidv4(),
      name: payload.name.trim(),
      description: payload.description,
      planType: payload.planType,
      price: payload.price,
      currency: payload.currency,
      billingCycle: payload.billingCycle,
      billingInterval: payload.billingInterval,
      jobPostsPerMonth: payload.jobPostsPerMonth,
      screeningCredits: payload.screeningCredits,
      resumeParsesPerMonth: payload.resumeParsesPerMonth ?? 0,
      aiScoreCredits: payload.aiScoreCredits ?? 0,
      featuresAccess: payload.featuresAccess,
      features: payload.features,
      isPopular: payload.isPopular ?? false,
      sortOrder: payload.sortOrder ?? 0,
      isActive: true,
      razorpayPlanId: payload.razorpayPlanId,
      createdAt: now,
      updatedAt: now,
    });

    return await this.subscriptionRepo.create(plan);
  }
}
