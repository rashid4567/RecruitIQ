import api from "@/api/axios";

import type {
  PlanFilterOptions,
  SubscriptionPlanRepository,
} from "../../Domain/repositories/subscription-plan.repository";

import {
  SubscriptionPlan,
  type FeaturesAccess,
  type PlanFeature,
  type SubscriptionPlanProps,
} from "../../Domain/entities/SubscriptionPlan.entity";

import type {
  BillingCycle,
  Currency,
  PlanType,
} from "../../Domain/constatns/subscription.constants";

interface RawPlanFeature {
  name: string;
  included: boolean;
}

interface RawFeaturesAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
}

type RawObjectId =
  | string
  | { $oid?: string; toString?: () => string }
  | undefined;

interface RawSubscriptionPlan {
  _id?: RawObjectId;

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

  featuresAccess?: Partial<RawFeaturesAccess>;

  features?: RawPlanFeature[];

  isPopular?: boolean;

  sortOrder?: number;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

interface PlanListApiResponse {
  success: boolean;
  message?: string;
  data: RawSubscriptionPlan[];
}

interface PlanDetailApiResponse {
  success: boolean;
  message?: string;
  data: RawSubscriptionPlan | null;
}

function extractId(raw: RawSubscriptionPlan): string {
  if (typeof raw.id === "string" && raw.id.trim().length > 0) {
    return raw.id.trim();
  }

  if (typeof raw._id === "string" && raw._id.trim().length > 0) {
    return raw._id.trim();
  }

  if (typeof raw._id === "object" && raw._id !== null) {
    if ("$oid" in raw._id && typeof raw._id.$oid === "string") {
      return raw._id.$oid.trim();
    }

    if (typeof raw._id.toString === "function") {
      const s = raw._id.toString();

      if (s.length > 0 && s !== "[object Object]") {
        return s.trim();
      }
    }
  }

  return "";
}

function unwrapList(body: unknown): RawSubscriptionPlan[] {
  if (body !== null && typeof body === "object" && "data" in body) {
    const inner = (body as { data: unknown }).data;

    if (Array.isArray(inner)) {
      return inner as RawSubscriptionPlan[];
    }
  }

  if (Array.isArray(body)) {
    return body as RawSubscriptionPlan[];
  }

  return [];
}

function unwrapSingle(body: unknown): RawSubscriptionPlan | null {
  if (body !== null && typeof body === "object" && "data" in body) {
    const inner = (body as { data: unknown }).data;

    if (inner === null) {
      return null;
    }

    if (typeof inner === "object" && !Array.isArray(inner)) {
      return inner as RawSubscriptionPlan;
    }
  }

  if (body !== null && typeof body === "object" && !Array.isArray(body)) {
    return body as RawSubscriptionPlan;
  }

  return null;
}

export class ApiSubscriptionPlanRepository implements SubscriptionPlanRepository {
  private hasValidId(plan: RawSubscriptionPlan): boolean {
    return extractId(plan).length > 0;
  }

  private filterValid(plans: RawSubscriptionPlan[]): RawSubscriptionPlan[] {
    return plans.filter((p) => this.hasValidId(p));
  }

  async findAll(filters?: PlanFilterOptions): Promise<SubscriptionPlan[]> {
    const params = new URLSearchParams();

    if (filters?.isActive !== undefined) {
      params.set("isActive", String(filters.isActive));
    }

    if (filters?.planType) {
      params.set("planType", filters.planType);
    }

    if (filters?.currency) {
      params.set("currency", filters.currency);
    }
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get<PlanListApiResponse>(`/recruiter/plans${qs}`);
    const raw = unwrapList(res.data);
    return this.filterValid(raw).map((p) => this.toEntity(p));
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const res = await api.get<PlanDetailApiResponse>(`/recruiter/plans/${id}`);
    const raw = unwrapSingle(res.data);
    if (!raw || !this.hasValidId(raw)) {
      return null;
    }
    return this.toEntity(raw);
  }

  async findActivePlans(): Promise<SubscriptionPlan[]> {
    const res = await api.get<PlanListApiResponse>("/recruiter/plans");
    const raw = unwrapList(res.data);
    return this.filterValid(raw).map((p) => this.toEntity(p));
  }

  async findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null> {
    const res = await api.get<PlanListApiResponse>(
      `/recruiter/plans?planType=${planType}&isActive=true`,
    );

    const raw = unwrapList(res.data);
    const valid = this.filterValid(raw);
    if (valid.length === 0) {
      return null;
    }
    return this.toEntity(valid[0]);
  }

  private toEntity(data: RawSubscriptionPlan): SubscriptionPlan {
    const id = extractId(data);
    if (!id) {
      throw new Error(`Cannot create SubscriptionPlan without valid id.`);
    }

    const featuresAccess: FeaturesAccess = {
      interviewScheduling: data.featuresAccess?.interviewScheduling ?? false,
      advancedAnalytics: data.featuresAccess?.advancedAnalytics ?? false,
      prioritySupport: data.featuresAccess?.prioritySupport ?? false,
    };

    const features: PlanFeature[] = (data.features ?? []).map((f) => ({
      name: f.name,
      included: f.included,
    }));

    const props: SubscriptionPlanProps = {
      id,
      name: data.name ?? "",
      description: data.description,
      planType: (data.planType ?? "free") as PlanType,
      price: data.price ?? 0,
      currency: (data.currency ?? "INR") as Currency,
      billingCycle: (data.billingCycle ?? "monthly") as BillingCycle,
      billingInterval: data.billingInterval ?? 1,
      jobPostsPerMonth: data.jobPostsPerMonth ?? 0,
      screeningCredits: data.screeningCredits ?? 0,
      featuresAccess,
      features,
      isPopular: data.isPopular ?? false,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };

    return SubscriptionPlan.create(props);
  }
}
