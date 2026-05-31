export interface CurrentSubscriptionResponse {
  id: string;
  planName: string;
  planType: string;
  planPrice: number;
  status: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  jobPostsUsed: number;
  jobPostsLimit: number;
  jobPostActiveDays: number; 
  screeningUsed: number;
  screeningLimit: number;
  resumeUsed: number;
  resumeLimit: number;
  aiScoreUsed: number;
  aiScoreLimit: number;
  autoRenew: boolean;
}