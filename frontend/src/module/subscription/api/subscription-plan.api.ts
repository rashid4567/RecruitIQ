import api from "@/api/axios";
import { RECRUITER_PLAN_ROUTES } from "../constant/recruiter-plan.routes";
import { toPlan } from "../mapper/subscription-plan.mapper";
import type { SubscriptionPlan } from "../types/subscription-plan.types";
import type { PlanType } from "../constant/subscription.constants";

export async function findAllPlans(filters?: {
  isActive?: boolean;
  planType?: PlanType;
}): Promise<SubscriptionPlan[]> {
  const { data } = await api.get(RECRUITER_PLAN_ROUTES.PLANS, {
    params: {
      isActive: filters?.isActive,
      planType: filters?.planType,
    },
  });

  return (data.data.data ?? []).map(toPlan);
}
export async function findActivePlans(): Promise<SubscriptionPlan[]> {
  const { data } = await api.get(RECRUITER_PLAN_ROUTES.PLANS);

  return (data.data.data ?? []).map(toPlan);
}

export async function findPlanById(
  id: string,
): Promise<SubscriptionPlan | null> {
  const { data } = await api.get(RECRUITER_PLAN_ROUTES.PLAN(id));
  if (!data.data) {
    return null;
  }
  return toPlan(data.data);
}

export async function findPlanByType(
  planType: PlanType,
): Promise<SubscriptionPlan | null> {
  const plans = await findAllPlans({
    planType,
    isActive: true,
  });
  return plans[0] ?? null;
}
