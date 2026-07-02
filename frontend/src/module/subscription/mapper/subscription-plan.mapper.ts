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

export type PlanSource =
  | RawSubscriptionPlan
  | WrappedSubscriptionPlan;

export const toPlan = (
  data: PlanSource,
): SubscriptionPlan => {
  const source = "props" in data ? data.props : data;

  const features: PlanFeature[] = (
    source.features ?? []
  ).map((feature) => ({
    name: feature.name,
    included: feature.included,
  }));

  const featuresAccess: FeatureAccess = {
    interviewScheduling:
      source.featuresAccess?.interviewScheduling ??
      false,
    advancedAnalytics:
      source.featuresAccess?.advancedAnalytics ??
      false,
    prioritySupport:
      source.featuresAccess?.prioritySupport ??
      false,
    aiResumeScoring:
      source.featuresAccess?.aiResumeScoring ??
      false,
    candidateShortlisting:
      source.featuresAccess?.candidateShortlisting ??
      false,
    exportReports:
      source.featuresAccess?.exportReports ??
      false,
  };

  return {
    id: String(source.id ?? source._id ?? ""),
    name: source.name ?? "",
    description: source.description,
    planType: (source.planType ?? "free") as PlanType,
    price: source.price ?? 0,
    currency: (source.currency ?? "INR") as Currency,
    billingCycle: (source.billingCycle ??
      "monthly") as BillingCycle,
    billingInterval: source.billingInterval ?? 1,
    jobPostsPerMonth:
      source.jobPostsPerMonth ?? 0,
    jobPostActiveDays:
      source.jobPostActiveDays ?? 7,
    screeningCredits:
      source.screeningCredits ?? 0,
    resumeParsesPerMonth:
      source.resumeParsesPerMonth ?? 0,
    aiScoreCredits:
      source.aiScoreCredits ?? 0,
    razorpayPlanId:
      source.razorpayPlanId,
    featuresAccess,
    features,
    isPopular:
      source.isPopular ?? false,
    sortOrder:
      source.sortOrder ?? 0,
    isActive:
      source.isActive ?? true,
    createdAt:
      source.createdAt ?? "",
    updatedAt:
      source.updatedAt ?? "",
  };
};