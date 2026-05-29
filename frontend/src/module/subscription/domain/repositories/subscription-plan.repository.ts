import type { PlanType } from "../constant/subscription.constants";
import type { SubscriptionPlan } from "../entity/SubscriptionPlan.entity";
export interface PlanFilterOptions {
  isActive?: boolean;
  planType?: PlanType;
  currency?: string;
}

export interface SubscriptionPlanRepository {
  findAll(filters?: PlanFilterOptions): Promise<SubscriptionPlan[]>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  findActivePlans(): Promise<SubscriptionPlan[]>;
  findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null>;
}
