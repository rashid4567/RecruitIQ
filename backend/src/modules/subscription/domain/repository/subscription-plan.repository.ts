import { PlanType } from "../entities/subscription-plan.entity";
import { SubscriptionPlan } from "../entities/subscription-plan.entity";

export interface SubscriptionPlanFilter {
  isActive?: boolean;
  planType?: PlanType;
  page?: number;
  limit?: number;
}
export interface SubscriptionPlanRepository {
  save(plan: SubscriptionPlan): Promise<void>;
  update(plan: SubscriptionPlan): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  findByPlanType(type: PlanType): Promise<SubscriptionPlan | null>;
  findAll(filter: SubscriptionPlanFilter): Promise<{
    data: SubscriptionPlan[];
    total: number;
  }>;
}
