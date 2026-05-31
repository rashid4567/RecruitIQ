import api from "@/api/axios";

import {
  SubscriptionPlan,
  type FeatureAccess,
  type PlanFeature,
  type SubscriptionPlanProps,
} from "../../domain/entity/SubscriptionPlan.entity";

import {
  PlanType,
  type BillingCycle,
  type Currency,
} from "../../domain/constant/subscription.constants";

import type {
  PlanFilterOptions,
  SubscriptionPlanRepository,
} from "../../domain/repositories/subscription-plan.repository";

interface RawPlanFeature {
  name: string;
  included: boolean;
}

interface RawFeaturesAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  aiResumeScoring: boolean;
  resumeParsing: boolean;
  candidateShortlisting: boolean;
  exportReports: boolean;
}

interface RawSubscriptionPlan {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  planType?: string;
  jobPostActiveDays: number;
  price?: number;
  currency?: string;
  billingCycle?: string;
  billingInterval?: number;
  jobPostsPerMonth?: number;
  screeningCredits?: number;
  resumeParsesPerMonth?: number;
  aiScoreCredits?: number;
  razorpayPlanId?: string;
  featuresAccess?: Partial<RawFeaturesAccess>;
  features?: RawPlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface WrappedSubscriptionPlan {
  props: RawSubscriptionPlan;
}
type PlanSource = RawSubscriptionPlan | WrappedSubscriptionPlan;
interface PlanListApiResponse {
  success: boolean;
  message?: string;
  data: PlanSource[];
}
interface PlanDetailApiResponse {
  success: boolean;
  message?: string;
  data: PlanSource | null;
}
export class ApiSubscriptionPlanRepository implements SubscriptionPlanRepository {
  async findAll(filters?: PlanFilterOptions): Promise<SubscriptionPlan[]> {
    const params = new URLSearchParams();
    if (filters?.planType) {
      params.set("planType", filters.planType);
    }
    if (filters?.isActive !== undefined) {
      params.set("isActive", String(filters.isActive));
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get<PlanListApiResponse>(`/recruiter/plans${query}`);
    return (res.data.data ?? []).map((item) => {
      return this.toEntity(item);
    });
  }

  async findActivePlans(): Promise<SubscriptionPlan[]> {
    const res = await api.get<PlanListApiResponse>("/recruiter/plans");
    const plans = res.data.data ?? [];
    return plans.map((item) => {
      return this.toEntity(item);
    });
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const res = await api.get<PlanDetailApiResponse>(`/recruiter/plans/${id}`);
    if (!res.data.data) {
      return null;
    }
    return this.toEntity(res.data.data);
  }
  async findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null> {
    const plans = await this.findAll({
      planType,
      isActive: true,
    });

    return plans[0] ?? null;
  }

  private toEntity(data: PlanSource): SubscriptionPlan {
    const source: RawSubscriptionPlan = "props" in data ? data.props : data;
    const extractedId = String(source.id ?? source._id ?? "").trim();

    const features: PlanFeature[] = (source.features ?? []).map(
      (item): PlanFeature => ({
        name: item.name,

        included: item.included,
      }),
    );

    const featuresAccess: FeatureAccess = {
      interviewScheduling: source.featuresAccess?.interviewScheduling ?? false,
      advancedAnalytics: source.featuresAccess?.advancedAnalytics ?? false,
      prioritySupport: source.featuresAccess?.prioritySupport ?? false,
      aiResumeScoring: source.featuresAccess?.aiResumeScoring ?? false,
      resumeParsing: source.featuresAccess?.resumeParsing ?? false,
      candidateShortlisting:
        source.featuresAccess?.candidateShortlisting ?? false,
      exportReports: source.featuresAccess?.exportReports ?? false,
    };
    const props: SubscriptionPlanProps = {
      id: extractedId,
      name: source.name ?? "",
      description: source.description,
      planType: (source.planType ?? PlanType.Free) as PlanType,
      jobPostActiveDays: source.jobPostActiveDays ?? 1,
      price: source.price ?? 0,
      currency: (source.currency ?? "INR") as Currency,
      billingCycle: (source.billingCycle ?? "monthly") as BillingCycle,
      billingInterval: source.billingInterval ?? 1,
      jobPostsPerMonth: source.jobPostsPerMonth ?? 0,
      screeningCredits: source.screeningCredits ?? 0,
      resumeParsesPerMonth: source.resumeParsesPerMonth ?? 0,
      aiScoreCredits: source.aiScoreCredits ?? 0,
      razorpayPlanId: source.razorpayPlanId,
      featuresAccess,
      features,
      isPopular: source.isPopular ?? false,
      sortOrder: source.sortOrder ?? 0,
      isActive: source.isActive ?? true,
      createdAt: source.createdAt ? new Date(source.createdAt) : new Date(),
      updatedAt: source.updatedAt ? new Date(source.updatedAt) : new Date(),
    };
    return SubscriptionPlan.create(props);
  }
}
