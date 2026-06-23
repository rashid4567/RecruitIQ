export interface GetCurrentSubscriptionRequestDTO {
  recruiterId: string;
}

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
  resumeDownloadedCount : number;
  jobPostsLimit: number;
  resumeDownloadLimit : number;
  jobPostActiveDays: number;
  screeningUsed: number;
  screeningLimit: number;
  aiScoreUsed: number;
  aiScoreLimit: number;
  autoRenew: boolean;
}