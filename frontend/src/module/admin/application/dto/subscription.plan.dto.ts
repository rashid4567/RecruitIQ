import type { BillingCycle, Currency, PlanType } from "@/module/subscription/domain/constant/subscription.constants";
import type { FeaturesAccess, PlanFeature } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";


export interface CreatePlanPayload {
  name: string;
  description?: string;
  planType: PlanType;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingInterval: number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
  featuresAccess: FeaturesAccess;
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
  screeningCredits?: number;
  resumeParsesPerMonth?: number;
  aiScoreCredits?: number;
  featuresAccess?: Partial<FeaturesAccess>;
  features?: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  razorpayPlanId?: string;
}