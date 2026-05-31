import { PaymentRepository } from "../../../domain/repository/payment.repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { PaymentGateway } from "../../ports/Paymentgateway.port";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import {
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../../domain/entities/recruiter-subscription.entity";

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  subscriptionId: string;
  paymentId: string;
  status: string;
}

export class VerifyPaymentUseCase {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    const payment = await this.paymentRepo.findByRazorpayOrderId(
      request.razorpayOrderId,
    );

    if (!payment) {
      throw new ApplicationError(ERROR_CODES.PAYMENT_NOT_FOUND);
    }

    if (payment.isPaid()) {
      throw new ApplicationError(ERROR_CODES.PAYMENT_ALREADY_VERIFIED);
    }

    const isValid = await this.paymentGateway.verifySignature({
      orderId: request.razorpayOrderId,
      paymentId: request.razorpayPaymentId,
      signature: request.razorpaySignature,
    });

    if (!isValid) {
      const failedPayment = payment.markFailed("Invalid Razorpay Signature");

      await this.paymentRepo.update(failedPayment);

      throw new ApplicationError(ERROR_CODES.INVALID_PAYMENT_SIGNATURE);
    }

    const plan = await this.planRepo.findById(payment.planId);

    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    const now = new Date();
    const endDate = new Date(now);

    switch (plan.billingCycle) {
      case "weekly":
        endDate.setDate(endDate.getDate() + 7 * plan.billingInterval);
        break;

      case "monthly":
        endDate.setMonth(endDate.getMonth() + plan.billingInterval);
        break;

      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + plan.billingInterval);
        break;
    }

    const subscription = RecruiterSubscription.create({
      recruiterId: payment.recruiterId,
      planId: plan.id,
      planName: plan.name,
      planPrice: plan.price,
      planType: plan.planType,
      jobPostActiveDays: plan.jobPostActiveDays,
      paymentReferenceId: payment.id,
      status: SubscriptionStatus.Active,
      startDate: now,
      endDate,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      autoRenew: false,
      jobPostsUsed: 0,
      screeningUsed: 0,
      resumeUsed: 0,
      aiScoreUsed: 0,
      jobPostsLimit: plan.jobPostsPerMonth,
      screeningLimit: plan.screeningCredits,
      resumeLimit: plan.resumeParsesPerMonth,
      aiScoreLimit: plan.aiScoreCredits,
      createdAt: now,
      updatedAt: now,
    });

    const savedSubscription = await this.subscriptionRepo.save(subscription);

    const paidPayment = payment
      .markPaid(request.razorpayPaymentId)
      .attachSubscription(savedSubscription.id!);

    await this.paymentRepo.update(paidPayment);
    return {
      subscriptionId: savedSubscription.id!,
      paymentId: paidPayment.id,
      status: "success",
    };
  }
}
