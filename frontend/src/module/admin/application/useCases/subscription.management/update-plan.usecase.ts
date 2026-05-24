import type { SubscriptionPlanRepository } from "@/module/admin/domain/repositories/subscription.repository";
import type { UpdatePlanPayload } from "../../dto/subscription.plan.dto";
import { SubscriptionPlan } from "@/module/admin/domain/entities/subscription-plan.entity";

export class UpdatePlanUseCase {
  private readonly subscriptionRepo: SubscriptionPlanRepository;
  constructor(subscriptionRepo: SubscriptionPlanRepository) {
    this.subscriptionRepo = subscriptionRepo;
  }

  async execute(
    PlanId: string,
    payLoad: UpdatePlanPayload,
  ): Promise<SubscriptionPlan> {
    const existing = await this.subscriptionRepo.getPlanById(PlanId);
    if (!existing) {
      throw new Error("Plan not found");
    }

    const updatedPlan = SubscriptionPlan.fromPersistence({
      ...existing.toPrimitives(),
      name: payLoad.name ?? existing.name,
      price: payLoad.price ?? existing.price,
      currency: payLoad.currency ?? existing.currency,
      billingCycle: payLoad.billingCycle ?? existing.billingCycle,
      billingInterval: payLoad.billingInterval ?? existing.billingInterval,
      jobPostsPerMonth: payLoad.jobPostsPerMonth ?? existing.jobPostsPerMonth,
      screeningCredits: payLoad.screeningCredits ?? existing.screeningCredits,
      featuresAccess: {
        ...existing.featuresAccess,
        ...payLoad.featuresAccess,
      },
      features: payLoad.features ?? existing.features,
      isPopular: payLoad.isPopular ?? existing.isPopular,
      sortOrder: payLoad.sortOrder ?? existing.sortOrder,
      description: payLoad.description ?? existing.description,
      razorpayPlanId: payLoad.razorpayPlanId ?? existing.razorpayPlanId,
      updatedAt: new Date(),
    });

    return this.subscriptionRepo.update(updatedPlan);
  }
}
