export interface RawRecruiterSubscription {
  _id?: string;
  id?: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planType: string;
  price: number;
  currency: string;
  billingCycle: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpayCustomerId?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  trialEndDate?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancellationNote?: string;
  renewsAt?: string;
  autoRenew: boolean;
  jobPostsUsed: number;
  screeningCreditsUsed: number;
  resumeParsesUsed: number;
  aiScoresUsed: number;
  jobPostsLimit: number;
  screeningCreditsLimit: number;
  resumeParsesLimit: number;
  aiScoresLimit: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
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