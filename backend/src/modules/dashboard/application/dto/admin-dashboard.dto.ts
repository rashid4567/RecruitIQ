export interface AdminDashboardRequestDTO {}

export interface AdminDashboardDTO {
  overview: AdminOverviewDTO;
  subscriptionGrowth: SubscriptionGrowthDTO[];
  revenueBreakdown: RevenueBreakdownDTO[];
  recentActivities: RecentActivityDTO[];
}

export interface AdminOverviewDTO {
  totalRecruiters: number;
  totalCandidates: number;
  totalJobPosts: number;
  totalApplications: number;
  monthlyRevenue: number;
}

export interface SubscriptionGrowthDTO {
  month: string;
  subscriptions: number;
  revenue: number;
}

export interface RevenueBreakdownDTO {
  planName: string;
  subscribers: number;
  revenue: number;
}

export interface RecentActivityDTO {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
}