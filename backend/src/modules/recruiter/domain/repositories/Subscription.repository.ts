import {
  PlanType,
  SubscriptionPlan,
} from "../entities/Subscriptionplan.entity";

export interface PlanFilterOptions {

  isActive?: boolean;
  planType?: PlanType;
  currency?: string;
}

export interface SubscriptionPlanRepository {

  findById(
    id: string
  ): Promise<SubscriptionPlan | null>;

  findAll(
    filters?: PlanFilterOptions
  ): Promise<SubscriptionPlan[]>;

  findActivePlans():
    Promise<SubscriptionPlan[]>;

  findByPlanType(
    planType: PlanType
  ): Promise<SubscriptionPlan | null>;
}