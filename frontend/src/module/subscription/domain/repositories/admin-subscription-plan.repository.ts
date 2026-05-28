import type { PlanType } from "../dto/subscription.constants";
import type { SubscriptionPlan } from "../entity/SubscriptionPlan.entity";

export interface AdminSubscriptionPlanRepository {
  getPlans(query: {
    page: number;
    limit: number;
    isActive?: boolean;
    planType?: PlanType;
  }): Promise<{ plans: SubscriptionPlan[]; total: number }>;

  getPlanById(planId: string): Promise<SubscriptionPlan | null>;
  getPlanByType(planType: PlanType): Promise<SubscriptionPlan | null>;
  create(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
  update(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
  hide(planId: string): Promise<void>;
  unhide(planId: string): Promise<void>;
}