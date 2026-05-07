import crypto from "crypto";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../constants/error.code.constants";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { BillingRecordRepository } from "../../../domain/repositories/billing.repository";
import { SubscriptionStatus } from "../../../domain/entities/Recruitersubscription.entity";

import {
  BillingEventType,
  BillingStatus,
} from "../../../domain/entities/Billingrecord.entity";

export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  subscriptionId: string;
  message: string;
}

export class VerifyPaymentUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly billingRepo: BillingRecordRepository,
    private readonly razorpayKeySecret: string,
  ) {}

  async execute(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    if (!this.razorpayKeySecret) {
      throw new ApplicationError(ERROR_CODES.INVALID_PAYMENT_SIGNATURE);
    }

    const payload = `${request.razorpay_order_id}|${request.razorpay_payment_id}`;

    const generatedSignature = crypto
      .createHmac("sha256", this.razorpayKeySecret.trim())
      .update(payload)
      .digest("hex");

    if (generatedSignature !== request.razorpay_signature) {
      throw new ApplicationError(ERROR_CODES.INVALID_PAYMENT_SIGNATURE);
    }

    const subscription = await this.subscriptionRepo.findByRazorpayOrderId(
      request.razorpay_order_id,
    );

    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }

    if (subscription.status === SubscriptionStatus.Active) {
      return {
        success: true,
        subscriptionId: subscription.id,
        message: "Subscription already active",
      };
    }

    await this.subscriptionRepo.updateStatus(
      subscription.id,
      SubscriptionStatus.Active,
    );

    const existingBilling = await this.billingRepo.findByRazorpayPaymentId(
      request.razorpay_payment_id,
    );

    if (!existingBilling) {
      await this.billingRepo.create({
        recruiterId: subscription.recruiterId,
        subscriptionId: subscription.id,
        planId: subscription.planId,
        planName: subscription.planName,
        amount: subscription.price,
        currency: subscription.currency,
        netAmount: subscription.price,
        razorpayPaymentId: request.razorpay_payment_id,
        razorpayOrderId: subscription.razorpayOrderId,
        eventType: BillingEventType.Subscription,
        status: BillingStatus.Paid,
        periodStart: subscription.startDate,
        periodEnd: subscription.endDate,
        paidAt: new Date(),
      });
    }

    return {
      success: true,
      subscriptionId: subscription.id,
      message: "Payment verified and subscription activated",
    };
  }
}
