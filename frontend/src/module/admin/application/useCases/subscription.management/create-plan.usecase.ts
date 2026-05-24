import { v4 as uuidv4 } from "uuid";
import type { SubscriptionPlan } from "../../../domain/entities/subscription-plan.entity";
import { SubscriptionPlan as PlanEntity } from "../../../domain/entities/subscription-plan.entity";
import type { SubscriptionPlanRepository } from "../../../domain/repositories/subscription.repository";
import type { CreatePlanPayload } from "../../dto/subscription.plan.dto";

export class CreatePlanUseCase {
  private readonly subscriptionRepo: SubscriptionPlanRepository;
  constructor(subscriptionRepo: SubscriptionPlanRepository) {
    this.subscriptionRepo = subscriptionRepo;
  }

  async execute(payload: CreatePlanPayload): Promise<SubscriptionPlan> {
    if (!payload.name?.trim()) {
      throw new Error("Plan name is required");
    }

    if (this.subscriptionRepo.getPlanByType) {
      const existing = await this.subscriptionRepo.getPlanByType(payload.planType);
      if (existing) {
        throw new Error("A plan with this type already exists");
      }
    }

    // Use fromPersistence instead of create — razorpayPlanId is assigned
    // by the backend after the API call, not by the frontend form.
    const plan = PlanEntity.fromPersistence({
      id: uuidv4(),
      name: payload.name.trim(),
      planType: payload.planType,
      price: payload.price,
      currency: payload.currency,
      billingCycle: payload.billingCycle,
      billingInterval: payload.billingInterval,
      jobPostsPerMonth: payload.jobPostsPerMonth,
      screeningCredits: payload.screeningCredits,
      featuresAccess: payload.featuresAccess,
      features: payload.features,
      isPopular: payload.isPopular ?? false,
      sortOrder: payload.sortOrder ?? 0,
      isActive: true,
      description: payload.description,
      razorpayPlanId: payload.razorpayPlanId, // will be undefined — that's fine
    });

    return await this.subscriptionRepo.create(plan);
  }
}