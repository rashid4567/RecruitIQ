import { PlanType } from "../entities/subscription-plan.entity";
import { SubscriptionPlanFilter } from "../../../admin/Domain/repositories/subscription-plan.repository";
import { SubscriptionPlan } from "../entities/subscription-plan.entity";

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
