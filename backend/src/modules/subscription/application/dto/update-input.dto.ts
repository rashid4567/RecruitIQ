import {
  FeatureAccess,
  PlanFeature,
} from "../../domain/entities/subscription-plan.entity";
export interface UpdatePlanInput {
  name?: string;
  description?: string;
  price?: number;
  currency?: "INR" | "USD" | "EUR" | "GBP";
  billingCycle?: "weekly" | "monthly" | "yearly";
  billingInterval?: number;
  jobPostsPerMonth?: number;
  jobPostActiveDays?: number;
  screeningCredits?: number;
  aiScoreCredits?: number;
  featuresAccess?: Partial<FeatureAccess>;
  features?: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  razorpayPlanId?: string;
}

export interface UpdateSubscriptionPlanRequestDTO {
  planId: string;
  data: UpdatePlanInput;
}