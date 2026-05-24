import { BillingCycle, Currency, FeaturesAccess, PlanFeature } from "../../../Domain/entities/subscription-plan.entity";

export interface UpdatePlanInput {
  name?:             string;
  price?:            number;
  currency?:         Currency;
  billingCycle?:     BillingCycle;
  billingInterval?:  number;
  jobPostsPerMonth?: number;
  screeningCredits?: number;
  featuresAccess?:   Partial<FeaturesAccess>;
  features?:         PlanFeature[];
  isPopular?:        boolean;
  sortOrder?:        number;
  description?:      string;
  razorpayPlanId?:   string;
}