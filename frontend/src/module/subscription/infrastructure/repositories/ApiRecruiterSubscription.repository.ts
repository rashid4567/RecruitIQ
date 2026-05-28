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

import type {
  CancellationReason,
  SubscriptionStatus,
} from "../../../subscription/domain/dto/subscription.constants";

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

    const res = await api.get<SingleSubscriptionApiResponse>(
      "/recruiter/subscriptions/current",
    );

    

    if (!res.data.data) {
      console.warn("[SubscriptionRepo] No active subscription found");
      return null;
    }

    return this.toEntity(res.data.data);
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
      planType: data.planType,
      price: data.price,
      currency: data.currency,
      billingCycle: data.billingCycle,
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpayCustomerId: data.razorpayCustomerId,
      status: data.status as SubscriptionStatus,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : new Date(),
      trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : undefined,
      cancelledAt: data.cancelledAt ? new Date(data.cancelledAt) : undefined,
      cancellationReason: data.cancellationReason
        ? (data.cancellationReason as CancellationReason)
        : undefined,
      cancellationNote: data.cancellationNote,
      renewsAt: data.renewsAt ? new Date(data.renewsAt) : undefined,
      autoRenew: data.autoRenew ?? false,
      jobPostsUsed: data.jobPostsUsed ?? 0,
      screeningCreditsUsed: data.screeningCreditsUsed ?? 0,
      resumeParsesUsed: data.resumeParsesUsed ?? 0,
      aiScoresUsed: data.aiScoresUsed ?? 0,
      jobPostsLimit: data.jobPostsLimit ?? 0,
      screeningCreditsLimit: data.screeningCreditsLimit ?? 0,
      resumeParsesLimit: data.resumeParsesLimit ?? 0,
      aiScoresLimit: data.aiScoresLimit ?? 0,
      currentPeriodStart: data.currentPeriodStart
        ? new Date(data.currentPeriodStart)
        : new Date(),
      currentPeriodEnd: data.currentPeriodEnd
        ? new Date(data.currentPeriodEnd)
        : new Date(),
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
    const entity = RecruiterSubscription.create(props);
    return entity;
  }
}
