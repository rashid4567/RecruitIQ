import type {
  PlanType,
  Currency,
  BillingCycle,
  FeaturesAccess,
  PlanFeature,
} from "../../domain/entities/subscription-plan.entity";

export interface CreatePlanPayload {
  name: string;
  planType: PlanType;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingInterval: number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  featuresAccess: FeaturesAccess;
  features: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  description?: string;
  razorpayPlanId?: string;
}

export interface UpdatePlanPayload {
  name?: string;
  price?: number;
  currency?: Currency;
  billingCycle?: BillingCycle;
  billingInterval?: number;
  jobPostsPerMonth?: number;
  screeningCredits?: number;
  featuresAccess?: Partial<FeaturesAccess>;
  features?: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  description?: string;
  razorpayPlanId?: string;
}
