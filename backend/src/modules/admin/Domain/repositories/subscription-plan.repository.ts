import {
  SubscriptionPlan,
  PlanType,
} from "../entities/subscription-plan.entity";

export interface SubscriptionPlanFilter {
  isActive?: boolean;
  planType?: PlanType;
  page?: number;
  limit?: number;
}

export interface SubscriptionPlanRepository {
  findAll(filter: SubscriptionPlanFilter): Promise<{
    data: SubscriptionPlan[];
    total: number;
  }>;

  findById(planId: string): Promise<SubscriptionPlan | null>;

  findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null>;

  findByRazorpayPlanId(
    razorpayPlanId: string,
  ): Promise<SubscriptionPlan | null>;

  create(plan: SubscriptionPlan): Promise<SubscriptionPlan>;

  update(plan: SubscriptionPlan): Promise<SubscriptionPlan>;

  setActive(planId: string, isActive: boolean): Promise<void>;
}
