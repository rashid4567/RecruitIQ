import type {
  PlanType,
  SubscriptionPlan,
} from "@/module/admin/domain/entities/subscription-plan.entity";
import type { SubscriptionPlanRepository } from "@/module/admin/domain/repositories/subscription.repository";

export interface GetPlanQuery {
  page: number;
  limit: number;
  isActive?: boolean;
  planType?: PlanType;
}

export class GetPlansUseCase {
  private readonly subscriptionPlanRepo: SubscriptionPlanRepository;

  constructor(subscriptionPlanRepo: SubscriptionPlanRepository) {
    this.subscriptionPlanRepo = subscriptionPlanRepo;
  }

  async execute(
    query: GetPlanQuery
  ): Promise<{ plans: SubscriptionPlan[]; total: number }> {
    return this.subscriptionPlanRepo.getPlans(query);
  }
}