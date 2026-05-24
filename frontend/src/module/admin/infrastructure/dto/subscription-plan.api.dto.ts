
export interface SubscriptionPlanApiDto {
  id: string;
  name: string;
  planType: "free" | "basic" | "pro" | "enterprise";
  price: number;
  currency: "INR" | "USD" | "EUR" | "GBP";
  billingCycle: "weekly" | "monthly" | "yearly";
  billingInterval: number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  featuresAccess: {
    interviewScheduling: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
  };
  features: {
    name: string;
    included: boolean;
  }[];
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  description?: string;
  razorpayPlanId?: string;
  createdAt?: string;
  updatedAt?: string;
}