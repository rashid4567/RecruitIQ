import type {
  BillingCycle,
  Currency,
  PlanType,
} from "@/module/subscription/constant/subscription.constants";

import type {
  FeatureAccess,
  PlanFeature,
} from "@/module/subscription/domain/entity/SubscriptionPlan.entity";

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
  jobPostActiveDays: number;
  resumeParsesPerMonth : number;
  aiScoreCredits: number;
  featuresAccess: FeatureAccess;
  features: PlanFeature[];
  isPopular: boolean;
  sortOrder: number;
  razorpayPlanId?: string;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string;
  planType?: PlanType;
  price?: number;
  currency?: Currency;
  billingCycle?: BillingCycle;
  billingInterval?: number;
  jobPostsPerMonth?: number;
  screeningCredits?: number;
  aiScoreCredits?: number;
  featuresAccess?: Partial<FeatureAccess>;
  features?: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  razorpayPlanId?: string;
}
