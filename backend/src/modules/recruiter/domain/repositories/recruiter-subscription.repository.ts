import {
  CancellationReason,
  RecruiterSubscription,
  SubscriptionStatus,
} from "../entities/Recruitersubscription.entity";

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
  recruiterId: string;
  planId: string;
  planName: string;
  planType: string;
  price: number;
  currency: string;
  billingCycle: string;
  jobPostsLimit: number;
  screeningCreditsLimit: number;
  startDate: Date;
  endDate: Date;
  renewsAt?: Date;
  autoRenew: boolean;
  razorpaySubscriptionId?: string;
  razorpayOrderId?: string;
  razorpayCustomerId?: string;
  trialEndDate?: Date;
  status: SubscriptionStatus;
}

export interface CancelInput {
  subscriptionId: string;
  cancelledAt: Date;
  reason: CancellationReason;
  note?: string;
  cancelAtPeriodEnd: boolean;
}

export interface ChangePlanInput {
  subscriptionId: string;
  newPlanId: string;
  newPlanName: string;
  newPlanType: string;
  newPrice: number;
  newCurrency: string;
  newBillingCycle: string;
  newJobPostsLimit: number;
  newScreeningCreditsLimit: number;
  newEndDate: Date;
  newRazorpaySubscriptionId?: string;
  changeReason: CancellationReason;
}

export interface UsageUpdateInput {
  subscriptionId: string;
  jobPostsDelta?: number;
  screeningCreditsDelta?: number;
}

export interface RenewInput {
  subscriptionId: string;
  newStartDate: Date;
  newEndDate: Date;
  newRenewsAt?: Date;
}

export interface RecruiterSubscriptionRepository {
  findById(id: string): Promise<RecruiterSubscription | null>;
  findActiveByRecruiterId(recruiterId: string): Promise<RecruiterSubscription | null>;
  findAllByRecruiterId(recruiterId: string, pagination?: PaginationOptions): Promise<PaginatedResult<RecruiterSubscription>>;
  findByRazorpaySubscriptionId(razorpaySubscriptionId: string): Promise<RecruiterSubscription | null>;
  findByStatus(status: SubscriptionStatus, pagination?: PaginationOptions): Promise<PaginatedResult<RecruiterSubscription>>;
  findExpiringWithin(days: number): Promise<RecruiterSubscription[]>;
  create(input: SubscribeInput): Promise<RecruiterSubscription>;
  cancel(input: CancelInput): Promise<RecruiterSubscription>;
  changePlan(input: ChangePlanInput): Promise<RecruiterSubscription>;
  renew(input: RenewInput): Promise<RecruiterSubscription>;
  updateUsage(input: UsageUpdateInput): Promise<RecruiterSubscription>;
  updateStatus(subscriptionId: string, status: SubscriptionStatus): Promise<RecruiterSubscription>;
  resetPeriodUsage(subscriptionId: string, newPeriodStart: Date, newPeriodEnd: Date): Promise<RecruiterSubscription>;
}