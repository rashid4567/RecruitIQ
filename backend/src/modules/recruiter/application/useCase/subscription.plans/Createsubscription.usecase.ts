import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../constants/error.code.constants";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { SubscriptionPlanRepository } from "../../../domain/repositories/Subscription.repository";
import { SubscriptionStatus } from "../../../domain/entities/Recruitersubscription.entity";
import { BillingCycle } from "../../../domain/entities/Subscriptionplan.entity";
import { PaymentGateway } from "../../../../subscription/application/ports/payment-gateway.port";

export interface CreateSubscriptionRequest {
  recruiterId: string;
  planId: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  razorpayKeyId: string;
  planName: string;
  amount: number;
  currency: string;
  billingCycle: string;
  orderId: string;
}

export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly razorpayKeyId: string,
  ) {}

  async execute(
    request: CreateSubscriptionRequest,
  ): Promise<CreateSubscriptionResponse> {
    const existing = await this.subscriptionRepo.findActiveByRecruiterId(
      request.recruiterId,
    );

    if (existing) {
      throw new ApplicationError(
        ERROR_CODES.ACTIVE_SUBSCRIPTION_ALREADY_EXISTS,
      );
    }

    const plan = await this.planRepo.findById(request.planId);

    if (!plan || !plan.isActive) {
      throw new ApplicationError(
        ERROR_CODES.SUBSCRIPTION_PLAN_NOT_FOUND_OR_INACTIVE,
      );
    }

    if (plan.isFree) {
      throw new ApplicationError(
        ERROR_CODES.FREE_PLAN_DOES_NOT_REQUIRE_PAYMENT,
      );
    }

    const razorpayOrder = await this.paymentGateway.createOrder({
      amount: plan.price,
      currency: plan.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        recruiterId: request.recruiterId,
        planId: plan.id,
        planName: plan.name,
      },
    });

    const now = new Date();

    const endDate = this.calculateEndDate(
      now,
      plan.billingCycle,
      plan.billingInterval,
    );

    const subscription = await this.subscriptionRepo.create({
      recruiterId: request.recruiterId,
      planId: plan.id,
      planName: plan.name,
      planType: plan.planType,
      price: plan.price,
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      jobPostsLimit: plan.jobPostsPerMonth,
      screeningCreditsLimit: plan.screeningCredits,
      startDate: now,
      endDate,
      autoRenew: false,
      razorpayOrderId: razorpayOrder.id,
      status: SubscriptionStatus.Pending,
    });

    return {
      subscriptionId: subscription.id,
      razorpayKeyId: this.razorpayKeyId,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      orderId: razorpayOrder.id,
    };
  }

  private calculateEndDate(
    from: Date,
    billingCycle: string,
    interval: number,
  ): Date {
    const end = new Date(from);
    switch (billingCycle) {
      case BillingCycle.Weekly:
        end.setDate(end.getDate() + 7 * interval);
        break;
      case BillingCycle.Yearly:
        end.setFullYear(end.getFullYear() + interval);
        break;
      case BillingCycle.Monthly:
      default:
        end.setMonth(end.getMonth() + interval);
        break;
    }
    return end;
  }
}
