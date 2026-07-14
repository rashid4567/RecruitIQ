import { BillingCycle, Currency, FeatureAccess, PlanFeature, PlanType } from "../../../../subscription/domain/entities/subscription-plan.entity";

export interface CreatePlanInput {
  name:             string;
  planType:         PlanType;
  price:            number;
  currency:         Currency;
  billingCycle:     BillingCycle;
  billingInterval:  number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  featuresAccess:   FeatureAccess;
  features:         PlanFeature[];
  isPopular:        boolean;
  sortOrder:        number;
  description?:     string;
  razorpayPlanId?:  string;
}