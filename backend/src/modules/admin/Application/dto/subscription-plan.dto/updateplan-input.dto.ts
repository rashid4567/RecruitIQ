import { FeatureAccess, PlanFeature } from "../../../../subscription/domain/entities/subscription-plan.entity";


export interface UpdatePlanInput {
  name?: string;
  price?: number;
  currency?: "INR" | "USD" | "EUR" | "GBP";
  billingCycle?: "weekly" | "monthly" | "yearly";
  billingInterval?: number;
  jobPostsPerMonth?: number;
  screeningCredits?: number;
  resumeParsesPerMonth?: number;
  aiScoreCredits?: number;
  featuresAccess?: Partial<FeatureAccess>;
  features?: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  description?: string;
  razorpayPlanId?: string;
}
