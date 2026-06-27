import type { PlanType, SubscriptionStatus } from "../constant/subscription.constants";


export interface RecruiterSubscription {
  id: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: PlanType;
  durationMonths: number;
  jobPostActiveDays: number;
  paymentReferenceId?: string;
  status: SubscriptionStatus;
  startDate: string | null;
  endDate: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  autoRenew: boolean;
  cancelledAt?: string;
  jobPostsUsed: number;
  screeningUsed: number;
  aiScoreUsed: number;
  jobPostsLimit: number;
  screeningLimit: number;
  aiScoreLimit: number;
  createdAt: string;
  updatedAt: string;
}


export interface RawRecruiterSubscription {
  _id?: string;
  id?: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: string;
  durationMonths: number;
  jobPostActiveDays: number;
  paymentReferenceId?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  autoRenew: boolean;
  cancelledAt?: string;
  jobPostsUsed: number;
  screeningUsed: number;
  aiScoreUsed: number;
  jobPostsLimit: number;
  screeningLimit: number;
  aiScoreLimit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawPaginatedSubscriptions {
  data: RawRecruiterSubscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}



export interface PaginationOptions {
  page?: number;
  limit?: number;
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