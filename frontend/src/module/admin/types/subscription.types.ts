import type { BillingCycle, Currency, PlanType } from "@/module/subscription/domain/constant/subscription.constants";


export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface FeatureAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
}

export interface CreatePlanPayload {
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

  isPopular?: boolean;
  sortOrder?: number;

  razorpayPlanId?: string;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string;

  price?: number;
  currency?: Currency;

  billingCycle?: BillingCycle;
  billingInterval?: number;

  jobPostsPerMonth?: number;
  jobPostActiveDays?: number;

  screeningCredits?: number;
  resumeParsesPerMonth?: number;
  aiScoreCredits?: number;

  featuresAccess?: Partial<FeatureAccess>;
  features?: PlanFeature[];

  isPopular?: boolean;
  sortOrder?: number;

  razorpayPlanId?: string;
}