import type { BillingCycle, Currency, PlanType } from "../constant/subscription.constants";
import type { FeatureAccess, PlanFeature } from "./subscription-plan.types";


export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  planType: PlanType;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingInterval: number;
  jobPostsPerMonth: number;
  jobPostActiveDays: number;
  screeningCredits: number;
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
  featuresAccess: FeatureAccess;
  features: PlanFeature[];
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  razorpayPlanId?: string;
  createdAt: Date;
  updatedAt: Date;
}