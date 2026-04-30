
import api from "@/api/axios";
import { SubscriptionPlan } from "../../domain/entities/subscription-plan.entity";

import type { PlanType } from "../../domain/entities/subscription-plan.entity";
import type { SubscriptionPlanApiDto } from "../dto/subscription-plan.api.dto";
import type { SubscriptionPlanRepository } from "../../domain/repositories/subscription.repository";

function mapDtoToSubscriptionPlan(dto: SubscriptionPlanApiDto): SubscriptionPlan {
  return SubscriptionPlan.fromPersistence({
    id: dto.id,
    name: dto.name,
    planType: dto.planType,
    price: dto.price,
    currency: dto.currency,
    billingCycle: dto.billingCycle,
    billingInterval: dto.billingInterval,
    jobPostsPerMonth: dto.jobPostsPerMonth,
    screeningCredits: dto.screeningCredits,
    featuresAccess: {
      interviewScheduling: dto.featuresAccess.interviewScheduling,
      advancedAnalytics: dto.featuresAccess.advancedAnalytics,
      prioritySupport: dto.featuresAccess.prioritySupport,
    },
    features: dto.features.map((f) => ({
      name: f.name,
      included: f.included,
    })),
    isPopular: dto.isPopular,
    sortOrder: dto.sortOrder,
    isActive: dto.isActive,
    description: dto.description,
    razorpayPlanId: dto.razorpayPlanId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  });
}

export class ApiSubscriptionPlanRepository implements SubscriptionPlanRepository {

 async getPlans(query: {
  page: number;
  limit: number;
  isActive?: boolean;
  planType?: PlanType;
}): Promise<{ plans: SubscriptionPlan[]; total: number }> {
  const { data } = await api.get("/admin/plans", { params: query });

 
  const rawPlans: SubscriptionPlanApiDto[] =
    data?.data?.plans ??      
    data?.data?.data ??     
    (Array.isArray(data?.data) ? data.data : null) ??
    data?.plans ??            
    data?.data ??           
    [];

  const total: number =
    data?.data?.total ??
    data?.total ??
    rawPlans.length;

  return {
    plans: rawPlans.map(mapDtoToSubscriptionPlan),
    total,
  };
}

  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    try {
      const { data } = await api.get(`/admin/plans/${planId}`);
      return mapDtoToSubscriptionPlan(data.data);
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  }

  async getPlanByType(planType: PlanType): Promise<SubscriptionPlan | null> {
    try {
      const { data } = await api.get("/admin/plans", {
        params: { planType, page: 1, limit: 1 },
      });

      const payload = data.data;
      const plans: SubscriptionPlanApiDto[] = payload?.plans ?? payload?.data ?? [];

      if (!plans.length) return null;
      return mapDtoToSubscriptionPlan(plans[0]);
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  }

  async create(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const { data } = await api.post("/admin/plans", plan.toPrimitives());
    return mapDtoToSubscriptionPlan(data.data);
  }

  async update(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const { data } = await api.put(
      `/admin/plans/${plan.id}`,
      plan.toPrimitives(),
    );
    return mapDtoToSubscriptionPlan(data.data);
  }

  async hide(planId: string): Promise<void> {
    await api.patch(`/admin/plans/${planId}/hide`);
  }

  async unhide(planId: string): Promise<void> {
    await api.patch(`/admin/plans/${planId}/unhide`);
  }
}