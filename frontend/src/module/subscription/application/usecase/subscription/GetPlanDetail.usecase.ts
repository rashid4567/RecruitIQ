import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";
import type { SubscriptionPlanRepository } from "@/module/recruiter/Domain/repositories/subscription-plan.repository";

export interface GetPlanDetailResponse {
  plan: SubscriptionPlan;
}

export class GetPlanDetailUseCase {
  private readonly planRepo: SubscriptionPlanRepository;

  constructor(planRepo: SubscriptionPlanRepository) {
    this.planRepo = planRepo;
  }

  async execute(planId: string): Promise<GetPlanDetailResponse> {
    if (!planId || planId.trim() === "") {
      throw new Error("PlanId is required");
    }

    const plan = await this.planRepo.findById(planId);

    if (!plan) {
      throw new Error(`Plan not found for id: ${planId}`);
    }

    if (!plan.isActive) {
      throw new Error("Plan is no longer available");
    }

    return { plan };
  }
}