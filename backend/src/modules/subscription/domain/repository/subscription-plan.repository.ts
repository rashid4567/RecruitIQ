import { BaseRepository } from "../../../../shared/repositories/base.repository";
import {
  PlanType,
  SubscriptionPlan,
} from "../entities/subscription-plan.entity";

export interface SubscriptionPlanFilter {
  isActive?: boolean;
  planType?: PlanType;
  page?: number;
  limit?: number;
}

export interface SubscriptionPlanRepository extends BaseRepository<SubscriptionPlan> {
  save(plan: SubscriptionPlan): Promise<void>;
  update(plan: SubscriptionPlan): Promise<void>;
  delete(id: string): Promise<void>;
  findByPlanType(type: PlanType): Promise<SubscriptionPlan | null>;
  findAll(filter: SubscriptionPlanFilter): Promise<{
    data: SubscriptionPlan[];
    total: number;
  }>;
}
