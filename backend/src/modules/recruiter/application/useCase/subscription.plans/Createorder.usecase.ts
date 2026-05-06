import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { SubscriptionPlanRepository } from "../../../domain/repositories/Subscription.repository";
import { SubscriptionStatus } from "../../../domain/entities/Recruitersubscription.entity";
import { ERROR_CODES } from "../../constants/error.code.constants";
import { PaymentGateway } from "../../ports/payment-gateway.port";

export interface CreateOrderRequest {
  recruiterId: string;
  planId: string;
}

export interface CreateOrderResponse {
  subscriptionId: string;
  razorpayKeyId: string;
  planName: string;
  amount: number;
  currency: string;
}

export class CreateOrderUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly razorpayKeyId: string, // injected
  ) {}

  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    // 1. Prevent duplicate active subscription
    const existing = await this.subscriptionRepo.findActiveByRecruiterId(
      request.recruiterId
    );

    if (existing) {
      throw new ApplicationError(
        ERROR_CODES.ACTIVE_SUBSCRIPTION_ALREADY_EXISTS
      );
    }

    // 2. Get plan
    const plan = await this.planRepo.findById(request.planId);

    if (!plan || !plan.isActive) {
      throw new ApplicationError(
        ERROR_CODES.SUBSCRIPTION_PLAN_NOT_FOUND_OR_INACTIVE
      );
    }

    if (!plan.razorpayPlanId) {
      throw new ApplicationError(
        ERROR_CODES.PLAN_NOT_CONFIGURED_FOR_RAZORPAY
      );
    }

    // 3. Create Razorpay subscription (via gateway)
    const razorpaySubscription = await this.paymentGateway.createSubscription({
      planId: plan.razorpayPlanId,
      totalCount: this.getTotalCount(plan.billingCycle),
      notes: {
        recruiterId: request.recruiterId,
        planId: plan.id,
        planName: plan.name,
      },
    });

    // 4. Calculate dates
    const now = new Date();
    const endDate = this.calculateEndDate(
      now,
      plan.billingCycle,
      plan.billingInterval
    );

    // 5. Save pending subscription
    await this.subscriptionRepo.create({
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
      autoRenew: true,
      razorpaySubscriptionId: razorpaySubscription.id,
      status: SubscriptionStatus.Pending,
    });

    // 6. Return response
    return {
      subscriptionId: razorpaySubscription.id,
      razorpayKeyId: this.razorpayKeyId,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
    };
  }

  private getTotalCount(billingCycle: string): number {
    switch (billingCycle) {
      case "yearly":
        return 12;
      case "monthly":
        return 120;
      case "weekly":
        return 520;
      default:
        return 120;
    }
  }

  private calculateEndDate(
    from: Date,
    billingCycle: string,
    interval: number
  ): Date {
    const end = new Date(from);

    switch (billingCycle) {
      case "weekly":
        end.setDate(end.getDate() + 7 * interval);
        break;
      case "yearly":
        end.setFullYear(end.getFullYear() + interval);
        break;
      case "monthly":
      default:
        end.setMonth(end.getMonth() + interval);
        break;
    }

    return end;
  }
}