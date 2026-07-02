import api from "@/api/axios";

import type {
  SubscriptionPlan,
  FeatureAccess,
  PlanFeature,
  RawSubscriptionPlan,
  CreatePlanPayload,
  UpdatePlanPayload,
} from "../types/subscription-plan.types";
import type {
  SubscriberFilters,
  PaginatedSubscribers,
  RawSubscribersResponse,
} from "../types/subscriber.types";
import type {
  PlanType,
  BillingCycle,
  Currency,
} from "../constant/subscription.constants";

interface WrappedSubscriptionPlan {
  props: RawSubscriptionPlan;
}
type PlanSource = RawSubscriptionPlan | WrappedSubscriptionPlan;

function toPlan(data: PlanSource): SubscriptionPlan {
  const source = "props" in data ? data.props : data;

  const features: PlanFeature[] = (source.features ?? []).map((feature) => ({
    name: feature.name,
    included: feature.included,
  }));

  const featuresAccess: FeatureAccess = {
    interviewScheduling: source.featuresAccess?.interviewScheduling ?? false,
    advancedAnalytics: source.featuresAccess?.advancedAnalytics ?? false,
    prioritySupport: source.featuresAccess?.prioritySupport ?? false,
    aiResumeScoring: source.featuresAccess?.aiResumeScoring ?? false,
    candidateShortlisting:
      source.featuresAccess?.candidateShortlisting ?? false,
    exportReports: source.featuresAccess?.exportReports ?? false,
  };

  return {
    id: String(source.id ?? source._id ?? ""),
    name: source.name ?? "",
    description: source.description,
    planType: (source.planType ?? "free") as PlanType,
    price: source.price ?? 0,
    currency: (source.currency ?? "INR") as Currency,
    billingCycle: (source.billingCycle ?? "monthly") as BillingCycle,
    billingInterval: source.billingInterval ?? 1,
    jobPostsPerMonth: source.jobPostsPerMonth ?? 0,
    jobPostActiveDays: source.jobPostActiveDays ?? 7,
    screeningCredits: source.screeningCredits ?? 0,
    resumeParsesPerMonth: source.resumeParsesPerMonth ?? 0,
    aiScoreCredits: source.aiScoreCredits ?? 0,
    razorpayPlanId: source.razorpayPlanId,
    featuresAccess,
    features,
    isPopular: source.isPopular ?? false,
    sortOrder: source.sortOrder ?? 0,
    isActive: source.isActive ?? true,
    createdAt: source.createdAt ?? "",
    updatedAt: source.updatedAt ?? "",
  };
}

export async function getPlans(query: {
  page: number;
  limit: number;
  isActive?: boolean;
  planType?: PlanType;
}): Promise<{ plans: SubscriptionPlan[]; total: number }> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.planType) {
    params.set("planType", query.planType);
  }
  if (query.isActive !== undefined) {
    params.set("isActive", String(query.isActive));
  }

  const { data } = await api.get(`/admin/plans?${params.toString()}`);
  const plans = (data.data ?? []).map(toPlan);
  return { plans, total: plans.length };
}

export async function getPlanById(
  planId: string,
): Promise<SubscriptionPlan | null> {
  const { data } = await api.get(`/admin/plans/${planId}`);
  if (!data.data) return null;
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
  const { data } = await api.post("/admin/plans", payload);

  return toPlan(data.data);
}

export async function updatePlan(
  id: string,
  payload: UpdatePlanPayload,
): Promise<SubscriptionPlan> {
  const { data } = await api.patch(`/admin/plans/${id}`, payload);

  return toPlan(data.data);
}

export async function hidePlan(planId: string): Promise<void> {
  await api.patch(`/admin/plans/${planId}/hide`);
}

export async function unhidePlan(planId: string): Promise<void> {
  await api.patch(`/admin/plans/${planId}/unhide`);
}

export async function getSubscribers(
  filters: SubscriberFilters,
): Promise<PaginatedSubscribers> {
  const { data } = await api.get<RawSubscribersResponse>("/admin/subscribers", {
    params: {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      status: filters.status,
    },
  });

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
