import type { PlanType } from "@/module/subscription/domain/dto/subscription.constants";
import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";
import type { AdminSubscriptionPlanRepository } from "@/module/subscription/domain/repositories/admin-subscription-plan.repository";
 
export interface GetPlanQuery {
  page: number;
  limit: number;
  isActive?: boolean;
  planType?: PlanType;
}

export class GetPlansUseCase {
  private readonly subscriptionPlanRepo: AdminSubscriptionPlanRepository;

  constructor(subscriptionPlanRepo: AdminSubscriptionPlanRepository) {
    this.subscriptionPlanRepo = subscriptionPlanRepo;
  }

  async execute(
    query: GetPlanQuery
  ): Promise<{ plans: SubscriptionPlan[]; total: number }> {
    return this.subscriptionPlanRepo.getPlans(query);
  }
}