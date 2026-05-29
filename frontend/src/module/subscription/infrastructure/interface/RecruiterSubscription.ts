export interface RawRecruiterSubscription {
  _id?: string;
  id?: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: string;
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
  resumeUsed: number;
  aiScoreUsed: number;
  jobPostsLimit: number;
  screeningLimit: number;
  resumeLimit: number;
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
