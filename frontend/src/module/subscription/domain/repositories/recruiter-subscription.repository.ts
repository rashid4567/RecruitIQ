import type { RecruiterSubscription } from "../entity/RecruiterSubscription.entity";

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscribeInput {
  planId: string;
  durationMonths: number;
}

export interface CancelSubscriptionInput {
  note?: string;
  cancelAtPeriodEnd: boolean;
}

export interface ChangePlanInput {
  newPlanId: string;
  durationMonths: number;
}

export interface RenewSubscriptionInput {
  subscriptionId: string;
  durationMonths: number;
}

export interface TrackUsageInput {
  jobPostDelta?: 1 | -1;
  screeningCreditsDelta?: 1 | -1;
}

export interface RecruiterSubscriptionRepository {
  getCurrentSubscription(): Promise<RecruiterSubscription | null>;

  getSubscriptionHistory(
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<RecruiterSubscription>>;

  subscribe(
    input: SubscribeInput,
  ): Promise<RecruiterSubscription>;

  upgradeSubscription(
    planId: string,
    durationMonths: number,
  ): Promise<void>;

  cancel(
    input: CancelSubscriptionInput,
  ): Promise<RecruiterSubscription>;

  changePlan(
    input: ChangePlanInput,
  ): Promise<RecruiterSubscription>;

  renew(
    input: RenewSubscriptionInput,
  ): Promise<RecruiterSubscription>;

  trackUsage(
    input: TrackUsageInput,
  ): Promise<RecruiterSubscription>;
}