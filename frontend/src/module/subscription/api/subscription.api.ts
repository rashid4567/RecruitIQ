import api from "@/api/axios";



import type {
  PlanType,
  SubscriptionStatus,
} from "../constant/subscription.constants";
import type { CancelSubscriptionInput, ChangePlanInput, PaginatedResult, PaginationOptions, RawPaginatedSubscriptions, RawRecruiterSubscription, RecruiterSubscription, RenewSubscriptionInput, SubscribeInput, TrackUsageInput } from "../types/RecruiterSubscription.types";

function toSubscription(
  data: RawRecruiterSubscription,
): RecruiterSubscription {
  return {
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
  };
}

export async function getCurrentSubscription(): Promise<RecruiterSubscription | null> {
  const { data } = await api.get("/recruiter/subscriptions/current");

  if (!data.data) {
    return null;
  }

  return toSubscription(data.data);
}

export async function getSubscriptionHistory(
  pagination?: PaginationOptions,
): Promise<PaginatedResult<RecruiterSubscription>> {
  const params = new URLSearchParams();

  if (pagination?.page) {
    params.set("page", String(pagination.page));
  }

  if (pagination?.limit) {
    params.set("limit", String(pagination.limit));
  }

  const query = params.toString();

  const { data } = await api.get(
    `/recruiter/subscriptions/history${query ? `?${query}` : ""}`,
  );

  const raw: RawPaginatedSubscriptions = data.data;

  return {
    data: raw.data.map(toSubscription),
    total: raw.total,
    page: raw.page,
    limit: raw.limit,
    totalPages: raw.totalPages,
  };
}

export async function subscribe(
  input: SubscribeInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.post(
    "/recruiter/subscriptions/subscribe",
    input,
  );

  return toSubscription(data.data);
}

export async function upgradeSubscription(
  planId: string,
  durationMonths: number,
): Promise<void> {
  await api.patch("/recruiter/subscription/upgrade", {
    planId,
    durationMonths,
  });
}

export async function cancelSubscription(
  input: CancelSubscriptionInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.patch(
    "/recruiter/subscriptions/cancel",
    input,
  );

  return toSubscription(data.data);
}

export async function changePlan(
  input: ChangePlanInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.patch(
    "/recruiter/subscriptions/change-plan",
    input,
  );

  return toSubscription(data.data.subscription);
}

export async function renewSubscription(
  input: RenewSubscriptionInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.patch(
    `/recruiter/subscriptions/${input.subscriptionId}/renew`,
    {
      durationMonths: input.durationMonths,
    },
  );

  return toSubscription(data.data);
}

export async function trackUsage(
  input: TrackUsageInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.patch(
    "/recruiter/subscriptions/track-usage",
    input,
  );

  return toSubscription(data.data);
}