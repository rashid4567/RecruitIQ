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
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpayCustomerId?: string;
  startDate: string;
  endDate: string;
  renewsAt?: string;
  autoRenew: boolean;
}

export interface CancelSubscriptionInput {
  note?: string;
  cancelAtPeriodEnd: boolean;
}

export interface ChangePlanInput {
  newPlanId: string;
  newEndDate: string;
}

export interface RenewSubscriptionInput {
  subscriptionId: string;
  newStartDate: string;
  newEndDate: string;
  newRenewsAt?: string;
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
  subscribe(input: SubscribeInput): Promise<RecruiterSubscription>;
  cancel(input: CancelSubscriptionInput): Promise<RecruiterSubscription>;
  changePlan(input: ChangePlanInput): Promise<RecruiterSubscription>;
  renew(input: RenewSubscriptionInput): Promise<RecruiterSubscription>;
  trackUsage(input: TrackUsageInput): Promise<RecruiterSubscription>;
}
