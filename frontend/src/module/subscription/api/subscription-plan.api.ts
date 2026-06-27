import api from "@/api/axios";

import type {
  SubscriptionPlan,
  FeatureAccess,
  PlanFeature,
  RawSubscriptionPlan,
} from "../types/subscription-plan.types";
import type {
  BillingCycle,
  Currency,
  PlanType,
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

export async function findAllPlans(filters?: {
  isActive?: boolean;
  planType?: PlanType;
}): Promise<SubscriptionPlan[]> {
  const params = new URLSearchParams();

  if (filters?.planType) {
    params.set("planType", filters.planType);
  }

  if (filters?.isActive !== undefined) {
    params.set("isActive", String(filters.isActive));
  }

  const query = params.toString();

  const { data } = await api.get(`/recruiter/plans${query ? `?${query}` : ""}`);

  return (data.data ?? []).map(toPlan);
}

export async function findActivePlans(): Promise<SubscriptionPlan[]> {
  const { data } = await api.get("/recruiter/plans");

  return (data.data ?? []).map(toPlan);
}

export async function findPlanById(
  id: string,
): Promise<SubscriptionPlan | null> {
  const { data } = await api.get(`/recruiter/plans/${id}`);

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
