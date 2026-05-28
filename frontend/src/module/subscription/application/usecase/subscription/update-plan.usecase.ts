import type { AdminSubscriptionPlanRepository } from "@/module/subscription/domain/repositories/admin-subscription-plan.repository";

import type { UpdatePlanPayload } from "../../../../admin/application/dto/subscription.plan.dto";

import { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";

export class UpdatePlanUseCase {
  private readonly subscriptionRepo: AdminSubscriptionPlanRepository;
  constructor(subscriptionRepo: AdminSubscriptionPlanRepository) {
    this.subscriptionRepo = subscriptionRepo;
  }

  async execute(
    planId: string,
    payload: UpdatePlanPayload,
  ): Promise<SubscriptionPlan> {
    const existing = await this.subscriptionRepo.getPlanById(planId);

    if (!existing) {
      throw new Error("Plan not found");
    }
    const updatedPlan = SubscriptionPlan.create({
      ...existing.toPlainObject(),
      name: payload.name ?? existing.name,
      description: payload.description ?? existing.description,
      price: payload.price ?? existing.price,
      currency: payload.currency ?? existing.currency,
      billingCycle: payload.billingCycle ?? existing.billingCycle,
      billingInterval: payload.billingInterval ?? existing.billingInterval,
      jobPostsPerMonth: payload.jobPostsPerMonth ?? existing.jobPostsPerMonth,
      screeningCredits: payload.screeningCredits ?? existing.screeningCredits,
      resumeParsesPerMonth:
        payload.resumeParsesPerMonth ?? existing.resumeParsesPerMonth,
      aiScoreCredits: payload.aiScoreCredits ?? existing.aiScoreCredits,
      featuresAccess: {
        ...existing.featuresAccess,
        ...payload.featuresAccess,
      },
      features: payload.features ?? existing.features,
      isPopular: payload.isPopular ?? existing.isPopular,
      sortOrder: payload.sortOrder ?? existing.sortOrder,
      razorpayPlanId: payload.razorpayPlanId ?? existing.razorpayPlanId,
      updatedAt: new Date(),
    });
    return this.subscriptionRepo.update(updatedPlan);
  }
}
