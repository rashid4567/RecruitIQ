import api from "@/api/axios";
import { RECRUITER_SUBSCRIPTION_ROUTES } from "../constant/recruiter-subscription.routes";
import { toSubscription } from "../mapper/recruiter-subscription.mapper";

import type {
  CancelSubscriptionInput,
  ChangePlanInput,
  PaginatedResult,
  PaginationOptions,
  RawPaginatedSubscriptions,
  RecruiterSubscription,
  RenewSubscriptionInput,
  SubscribeInput,
  TrackUsageInput,
} from "../types/RecruiterSubscription.types";

export async function getCurrentSubscription(): Promise<RecruiterSubscription | null> {
  const { data } = await api.get(RECRUITER_SUBSCRIPTION_ROUTES.CURRENT);

  if (!data.data) {
    return null;
  }
  return toSubscription(data.data);
}

export async function getSubscriptionHistory(
  pagination?: PaginationOptions,
): Promise<PaginatedResult<RecruiterSubscription>> {
  const { data } = await api.get(RECRUITER_SUBSCRIPTION_ROUTES.HISTORY, {
    params: {
      page: pagination?.page,
      limit: pagination?.limit,
    },
  });
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
    RECRUITER_SUBSCRIPTION_ROUTES.SUBSCRIBE,
    input,
  );
  return toSubscription(data.data);
}

export async function upgradeSubscription(
  planId: string,
  durationMonths: number,
): Promise<void> {
  await api.patch(RECRUITER_SUBSCRIPTION_ROUTES.UPGRADE, {
    planId,
    durationMonths,
  });
}

export async function cancelSubscription(
  input: CancelSubscriptionInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.patch(RECRUITER_SUBSCRIPTION_ROUTES.CANCEL, input);
  return toSubscription(data.data);
}

export async function changePlan(
  input: ChangePlanInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.patch(
    RECRUITER_SUBSCRIPTION_ROUTES.CHANGE_PLAN,
    input,
  );
  return toSubscription(data.data.subscription);
}

export async function renewSubscription(
  input: RenewSubscriptionInput,
): Promise<RecruiterSubscription> {
  const { data } = await api.patch(
    RECRUITER_SUBSCRIPTION_ROUTES.RENEW(input.subscriptionId),
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
    RECRUITER_SUBSCRIPTION_ROUTES.TRACK_USAGE,
    input,
  );
  return toSubscription(data.data);
}
