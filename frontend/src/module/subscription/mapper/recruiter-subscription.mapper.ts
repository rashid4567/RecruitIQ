import type {
  PlanType,
  SubscriptionStatus,
} from "../constant/subscription.constants";
import type {
  RawRecruiterSubscription,
  RecruiterSubscription,
} from "../types/RecruiterSubscription.types";

export const toSubscription = (
  data: RawRecruiterSubscription,
): RecruiterSubscription => ({
  id: data.id ?? data._id ?? "",
  recruiterId: data.recruiterId,
  planId: data.planId,
  planName: data.planName,
  planPrice: data.planPrice,
  planType: data.planType as PlanType,
  durationMonths: data.durationMonths ?? 1,
  jobPostActiveDays: data.jobPostActiveDays,
  paymentReferenceId: data.paymentReferenceId,
  status: data.status as SubscriptionStatus,
  startDate: data.startDate ?? null,
  endDate: data.endDate ?? null,
  currentPeriodStart: data.currentPeriodStart ?? null,
  currentPeriodEnd: data.currentPeriodEnd ?? null,
  autoRenew: data.autoRenew ?? false,
  cancelledAt: data.cancelledAt,
  jobPostsUsed: data.jobPostsUsed ?? 0,
  screeningUsed: data.screeningUsed ?? 0,
  aiScoreUsed: data.aiScoreUsed ?? 0,
  jobPostsLimit: data.jobPostsLimit ?? 0,
  screeningLimit: data.screeningLimit ?? 0,
  aiScoreLimit: data.aiScoreLimit ?? 0,
  createdAt: data.createdAt ?? "",
  updatedAt: data.updatedAt ?? "",
});