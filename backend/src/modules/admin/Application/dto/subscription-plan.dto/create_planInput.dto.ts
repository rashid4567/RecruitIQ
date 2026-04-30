import { BillingCycle, Currency, FeaturesAccess, PlanFeature, PlanType } from "../../../Domain/entities/subscription-plan.entity";

export interface CreatePlanInput {
  name:             string;
  planType:         PlanType;
  price:            number;
  currency:         Currency;
  billingCycle:     BillingCycle;
  billingInterval:  number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  featuresAccess:   FeaturesAccess;
  features:         PlanFeature[];
  isPopular:        boolean;
  sortOrder:        number;
  description?:     string;
  razorpayPlanId?:  string;
}