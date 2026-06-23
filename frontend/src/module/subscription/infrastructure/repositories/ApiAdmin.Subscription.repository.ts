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

import type { AdminSubscriptionPlanRepository } from "../../domain/repositories/admin-subscription-plan.repository";

interface RawPlanFeature {
  name: string;
  included: boolean;
}

interface RawFeaturesAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  aiResumeScoring: boolean;
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

export class ApiAdminSubscriptionPlanRepository implements AdminSubscriptionPlanRepository {
  async getPlans(query: {
    page: number;
    limit: number;
    isActive?: boolean;
    planType?: PlanType;
  }): Promise<{
    plans: SubscriptionPlan[];
    total: number;
  }> {
    console.log("GET PLANS QUERY:", query);
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("limit", String(query.limit));
    if (query.planType) {
      params.set("planType", query.planType);
    }
    if (query.isActive !== undefined) {
      params.set("isActive", String(query.isActive));
    }
    const res = await api.get<PlanListApiResponse>(
      `/admin/plans?${params.toString()}`,
    );
    console.log("PLAN RESPONSE:", res.data);
    const plans = (res.data.data ?? []).map((item) => this.toEntity(item));
    return {
      plans,
      total: plans.length,
    };
  }

  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    console.log("PLAN ID:", planId);
    const res = await api.get<PlanDetailApiResponse>(`/admin/plans/${planId}`);
    console.log("DETAIL RESPONSE:", res.data);
    if (!res.data.data) {
      return null;
    }
    return this.toEntity(res.data.data);
  }

  async getPlanByType(planType: PlanType): Promise<SubscriptionPlan | null> {
    console.log("PLAN TYPE:", planType);
    const result = await this.getPlans({
      page: 1,
      limit: 1,
      planType,
      isActive: true,
    });
    return result.plans[0] ?? null;
  }
  async create(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    console.log("CREATE:", plan.toPlainObject());
    const res = await api.post("/admin/plans", plan.toPlainObject());
    return this.toEntity(res.data.data);
  }
  async update(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const payload = {
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      billingInterval: plan.billingInterval,
      jobPostsPerMonth: plan.jobPostsPerMonth,
      jobPostActiveDays: plan.jobPostActiveDays,
      screeningCredits: plan.screeningCredits,
      aiScoreCredits: plan.aiScoreCredits,
      featuresAccess: plan.featuresAccess,
      features: plan.features,
      isPopular: plan.isPopular,
      sortOrder: plan.sortOrder,
      razorpayPlanId: plan.razorpayPlanId,
    };

    const res = await api.patch(`/admin/plans/${plan.id}`, payload);

    return this.toEntity(res.data.data);
  }

  async hide(planId: string): Promise<void> {
    console.log("HIDE:", planId);
    await api.patch(`/admin/plans/${planId}/hide`);
  }

  async unhide(planId: string): Promise<void> {
    console.log("UNHIDE:", planId);
    await api.patch(`/admin/plans/${planId}/unhide`);
  }

  private toEntity(data: PlanSource): SubscriptionPlan {
    const source = "props" in data ? data.props : data;
    const features: PlanFeature[] = (source.features ?? []).map((item) => ({
      name: item.name,
      included: item.included,
    }));

    const featuresAccess: FeatureAccess = {
      interviewScheduling: source.featuresAccess?.interviewScheduling ?? false,
      advancedAnalytics: source.featuresAccess?.advancedAnalytics ?? false,
      prioritySupport: source.featuresAccess?.prioritySupport ?? false,
      aiResumeScoring: source.featuresAccess?.aiResumeScoring ?? false,
      candidateShortlisting:
        source.featuresAccess?.candidateShortlisting ?? false,
      exportReports: source.featuresAccess?.exportReports ?? false,
    };
    const props: SubscriptionPlanProps = {
      id: String(source.id ?? source._id ?? "").trim(),
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
