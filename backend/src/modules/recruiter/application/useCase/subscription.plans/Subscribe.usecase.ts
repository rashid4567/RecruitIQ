import { ApplicationError } from "../../../../../shared/errors/application.error";
import {
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../../domain/entities/Recruitersubscription.entity";
import {
  RecruiterSubscriptionRepository,
  SubscribeInput,
} from "../../../domain/repositories/recruiter-subscription.repository";
import { SubscriptionPlanRepository } from "../../../domain/repositories/Subscription.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface SubscribeRequest {
  recruiterId: string;
  planId: string;
  razorpaySubscriptionId?: string;
  razorpayOrderId?: string;
  razorpayCustomerId?: string;
  startDate: Date;
  endDate: Date;
  renewsAt?: Date;
  autoRenew: boolean;
  status: SubscriptionStatus;
}

export type SubscribeResponse = RecruiterSubscription;




export class SubscribeUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly planRepo: SubscriptionPlanRepository,
  ) {}

  async execute(request: SubscribeRequest): Promise<SubscribeResponse> {
    const existing = await this.subscriptionRepo.findActiveByRecruiterId(
      request.recruiterId,
    );
    if (existing) {
  throw new ApplicationError(
    ERROR_CODES.ACTIVE_SUBSCRIPTION_ALREADY_EXISTS
  );
}

    const plan = await this.planRepo.findById(request.planId);
   if (!plan || !plan.isActive) {
  throw new ApplicationError(
    ERROR_CODES.SUBSCRIPTION_PLAN_NOT_FOUND_OR_INACTIVE
  );
}
    const input: SubscribeInput = {
      recruiterId: request.recruiterId,
      planId: plan.id,
      planName: plan.name,
      planType: plan.planType,
      price: plan.price,
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      jobPostsLimit: plan.jobPostsPerMonth,
      screeningCreditsLimit: plan.screeningCredits,
      startDate: request.startDate,
      endDate: request.endDate,
      renewsAt: request.renewsAt,
      autoRenew: request.autoRenew,
      razorpaySubscriptionId: request.razorpaySubscriptionId,
      razorpayOrderId: request.razorpayOrderId,
      razorpayCustomerId: request.razorpayCustomerId,

      status: request.status,
    };

    return this.subscriptionRepo.create(input);
  }
}
