import {
  BillingCycle,
  Currency,
  PlanType,
  FeatureAccess,
  PlanFeature,
} from "../../domain/entities/subscription-plan.entity";
export interface CreatePlanInput {
  name: string;
  description?: string;
  planType: "free" | "basic" | "pro" | "enterprise";
  price: number;
  currency: "INR" | "USD" | "EUR" | "GBP";
  billingCycle: "weekly" | "monthly" | "yearly";
  billingInterval: number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
  featuresAccess: FeatureAccess;
  features: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  razorpayPlanId?: string;
}
