import type {
  BillingCycle,
  Currency,
  PlanType,
} from "../constant/subscription.constants";


export interface FeatureAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  aiResumeScoring: boolean;
  candidateShortlisting: boolean;
  exportReports: boolean;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}



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
  screeningCredits: number;
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
  jobPostActiveDays: number;
  featuresAccess: FeatureAccess;
  features: PlanFeature[];
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  razorpayPlanId?: string;
  createdAt: string;
  updatedAt: string;
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
  screeningCredits: number;
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
  jobPostActiveDays: number;
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
  resumeParsesPerMonth?: number;
  aiScoreCredits?: number;
  jobPostActiveDays?: number;
  featuresAccess?: Partial<FeatureAccess>;
  features?: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  razorpayPlanId?: string;
}


export interface PlanFilterOptions {
  isActive?: boolean;
  planType?: PlanType;
  currency?: Currency;
}



export interface RawSubscriptionPlan {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  planType?: string;
  price?: number;
  currency?: string;
  billingCycle?: string;
  billingInterval?: number;
  jobPostsPerMonth?: number;
  screeningCredits?: number;
  resumeParsesPerMonth?: number;
  aiScoreCredits?: number;
  jobPostActiveDays?: number;
  razorpayPlanId?: string;
  featuresAccess?: Partial<FeatureAccess>;
  features?: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WrappedSubscriptionPlan {
  props: RawSubscriptionPlan;
}

export type PlanSource =
  | RawSubscriptionPlan
  | WrappedSubscriptionPlan;

export interface PlanListApiResponse {
  success: boolean;
  message?: string;
  data: PlanSource[];
}

export interface PlanDetailApiResponse {
  success: boolean;
  message?: string;
  data: PlanSource | null;
}