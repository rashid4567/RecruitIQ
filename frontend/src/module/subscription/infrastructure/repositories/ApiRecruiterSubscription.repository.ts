import api from "@/api/axios";

import {
  RecruiterSubscription,
  type RecruiterSubscriptionProps,
} from "../../../subscription/domain/entity/RecruiterSubscription.entity";

import type {
  CancelSubscriptionInput,
  ChangePlanInput,
  PaginatedResult,
  PaginationOptions,
  RecruiterSubscriptionRepository,
  RenewSubscriptionInput,
  SubscribeInput,
  TrackUsageInput,
} from "../../../subscription/domain/repositories/recruiter-subscription.repository";

import {
  PlanType,
  SubscriptionStatus,
} from "../../domain/constant/subscription.constants";
import type {
  RawPaginatedSubscriptions,
  RawRecruiterSubscription,
} from "../interface/RecruiterSubscription";

interface SingleSubscriptionApiResponse {
  data: RawRecruiterSubscription | null;
}

interface PaginatedSubscriptionApiResponse {
  data: RawPaginatedSubscriptions;
}

interface ChangePlanApiResponse {
  data: {
    subscription: RawRecruiterSubscription;
    direction: string;
  };
}

export class ApiRecruiterSubscriptionRepository implements RecruiterSubscriptionRepository {
  async getCurrentSubscription(): Promise<RecruiterSubscription | null> {
    const res = await api.get("/recruiter/subscriptions/current");

    const data = res.data?.data;

    if (!data) {
      return null;
    }

    return RecruiterSubscription.create({
      id: data.id,
      recruiterId: data.recruiterId,
      planId: data.planId,
      planName: data.planName,
      planPrice: data.planPrice,
      planType: data.planType,
      jobPostActiveDays: data.jobPostActiveDays,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      currentPeriodStart: new Date(data.currentPeriodStart),
      currentPeriodEnd: new Date(data.currentPeriodEnd),
      autoRenew: data.autoRenew,
      paymentReferenceId: undefined,
      cancelledAt: undefined,
      jobPostsUsed: data.jobPostsUsed,
      screeningUsed: data.screeningUsed,
      resumeUsed: data.resumeUsed,
      aiScoreUsed: data.aiScoreUsed,
      jobPostsLimit: data.jobPostsLimit,
      screeningLimit: data.screeningLimit,
      resumeLimit: data.resumeLimit,
      aiScoreLimit: data.aiScoreLimit,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async getSubscriptionHistory(
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<RecruiterSubscription>> {
    const params = new URLSearchParams();
    if (pagination?.page) {
      params.set("page", String(pagination.page));
    }
    if (pagination?.limit) {
      params.set("limit", String(pagination.limit));
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get<PaginatedSubscriptionApiResponse>(
      `/recruiter/subscriptions/history${query}`,
    );
    const raw = res.data.data;
    return {
      data: raw.data.map((item) => this.toEntity(item)),
      total: raw.total,
      page: raw.page,
      limit: raw.limit,
      totalPages: raw.totalPages,
    };
  }
  async subscribe(input: SubscribeInput): Promise<RecruiterSubscription> {
    const res = await api.post<SingleSubscriptionApiResponse>(
      "/recruiter/subscriptions/subscribe",
      input,
    );
    if (!res.data.data) {
      throw new Error("Subscription creation failed");
    }
    return this.toEntity(res.data.data);
  }

  async upgradeSubscription(planId: string): Promise<void> {
    await api.patch("/recruiter/subscription/upgrade",
    {
      planId,
    },
)
  }
  async cancel(input: CancelSubscriptionInput): Promise<RecruiterSubscription> {
    const res = await api.patch<SingleSubscriptionApiResponse>(
      "/recruiter/subscriptions/cancel",
      input,
    );
    if (!res.data.data) {
      throw new Error("Subscription cancellation failed");
    }
    return this.toEntity(res.data.data);
  }

  async changePlan(input: ChangePlanInput): Promise<RecruiterSubscription> {
    const res = await api.patch<ChangePlanApiResponse>(
      "/recruiter/subscriptions/change-plan",
      input,
    );
    return this.toEntity(res.data.data.subscription);
  }

  async renew(input: RenewSubscriptionInput): Promise<RecruiterSubscription> {
    const res = await api.patch<SingleSubscriptionApiResponse>(
      `/recruiter/subscriptions/${input.subscriptionId}/renew`,
      {
        newStartDate: input.newStartDate,
        newEndDate: input.newEndDate,
        newRenewsAt: input.newRenewsAt,
      },
    );
    if (!res.data.data) {
      throw new Error("Subscription renewal failed");
    }
    return this.toEntity(res.data.data);
  }

  async trackUsage(input: TrackUsageInput): Promise<RecruiterSubscription> {
    const res = await api.patch<SingleSubscriptionApiResponse>(
      "/recruiter/subscriptions/track-usage",
      input,
    );
    if (!res.data.data) {
      throw new Error("Usage tracking failed");
    }
    return this.toEntity(res.data.data);
  }

  private toEntity(data: RawRecruiterSubscription): RecruiterSubscription {
    const props: RecruiterSubscriptionProps = {
      id: data._id ?? data.id ?? "",
      recruiterId: data.recruiterId,
      planId: data.planId,
      planName: data.planName,
      planPrice: data.planPrice,
      planType: data.planType as PlanType,
      jobPostActiveDays: data.jobPostActiveDays,
      paymentReferenceId: data.paymentReferenceId,
      status: data.status as SubscriptionStatus,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : new Date(),
      currentPeriodStart: data.currentPeriodStart
        ? new Date(data.currentPeriodStart)
        : new Date(),
      currentPeriodEnd: data.currentPeriodEnd
        ? new Date(data.currentPeriodEnd)
        : new Date(),
      autoRenew: data.autoRenew ?? false,
      cancelledAt: data.cancelledAt ? new Date(data.cancelledAt) : undefined,
      jobPostsUsed: data.jobPostsUsed ?? 0,
      screeningUsed: data.screeningUsed ?? 0,
      resumeUsed: data.resumeUsed ?? 0,
      aiScoreUsed: data.aiScoreUsed ?? 0,
      jobPostsLimit: data.jobPostsLimit ?? 0,
      screeningLimit: data.screeningLimit ?? 0,
      resumeLimit: data.resumeLimit ?? 0,
      aiScoreLimit: data.aiScoreLimit ?? 0,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
    return RecruiterSubscription.create(props);
  }
}
