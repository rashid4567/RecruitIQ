import api from "@/api/axios";
import { SUBSCRIPTION_ROUTES } from "../constant/subscription.routes";
import { toPlan } from "../mapper/subscription-plan.mapper";

import type {
  SubscriptionPlan,
  CreatePlanPayload,
  UpdatePlanPayload,
} from "../types/subscription-plan.types";
import type {
  SubscriberFilters,
  PaginatedSubscribers,
  RawSubscribersResponse,
} from "../types/subscriber.types";
import type { PlanType } from "../constant/subscription.constants";

export async function getPlans(query: {
  page: number;
  limit: number;
  isActive?: boolean;
  planType?: PlanType;
}): Promise<{ plans: SubscriptionPlan[]; total: number }> {
  const { data } = await api.get(SUBSCRIPTION_ROUTES.PLANS, {
    params: {
      page: query.page,
      limit: query.limit,
      isActive: query.isActive,
      planType: query.planType,
    },
  });

  const plans = (data.data ?? []).map(toPlan);

  return {
    plans,
    total: plans.length,
  };
}

export async function getPlanById(
  planId: string,
): Promise<SubscriptionPlan | null> {
  const { data } = await api.get(SUBSCRIPTION_ROUTES.PLAN(planId));

  if (!data.data) {
    return null;
  }

  return toPlan(data.data);
}

export async function getPlanByType(
  planType: PlanType,
): Promise<SubscriptionPlan | null> {
  const result = await getPlans({
    page: 1,
    limit: 1,
    planType,
    isActive: true,
  });

  return result.plans[0] ?? null;
}

export async function createPlan(
  payload: CreatePlanPayload,
): Promise<SubscriptionPlan> {
  const { data } = await api.post(SUBSCRIPTION_ROUTES.PLANS, payload);
  return toPlan(data.data);
}
export async function updatePlan(
  id: string,
  payload: UpdatePlanPayload,
): Promise<SubscriptionPlan> {
  const { data } = await api.patch(SUBSCRIPTION_ROUTES.PLAN(id), payload);
  return toPlan(data.data);
}
export async function hidePlan(planId: string): Promise<void> {
  await api.patch(SUBSCRIPTION_ROUTES.HIDE_PLAN(planId));
}
export async function unhidePlan(planId: string): Promise<void> {
  await api.patch(SUBSCRIPTION_ROUTES.UNHIDE_PLAN(planId));
}

export async function getSubscribers(
  filters: SubscriberFilters,
): Promise<PaginatedSubscribers> {
  const { data } = await api.get<RawSubscribersResponse>(
    SUBSCRIPTION_ROUTES.SUBSCRIBERS,
    {
      params: {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        status: filters.status,
      },
    },
  );

  return {
    data: data.data.map((item) => ({
      id: item.id,
      recruiterId: item.recruiterId,
      recruiterName: item.recruiterName,
      companyName: item.companyName,
      planName: item.planName,
      status: item.status,
      startDate: item.startDate,
      endDate: item.endDate,
    })),
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  };
}
