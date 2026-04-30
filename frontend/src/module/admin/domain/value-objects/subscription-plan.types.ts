export type BillingCycle = "weekly" | "monthly" | "yearly";
export type Currency = "INR" | "USD" | "EUR" | "GBP";
export type PlanType = "free" | "basic" | "pro" | "enterprise";

export interface FeaturesAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}