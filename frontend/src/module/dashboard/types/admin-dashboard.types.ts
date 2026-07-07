export interface AdminDashboardResponse {
  overview: AdminOverview;
  subscriptionGrowth: SubscriptionGrowth[];
  revenueBreakdown: RevenueBreakdown[];
  recentActivities: RecentActivity[];
}

export interface AdminOverview {
  totalRecruiters: number;
  totalCandidates: number;
  totalJobPosts: number;
  totalApplications: number;
  monthlyRevenue: number;
}

export interface SubscriptionGrowth {
  month: string;
  subscriptions: number;
  revenue: number;
}

export interface RevenueBreakdown {
  planName: string;
  subscribers: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  createdAt: string;
}