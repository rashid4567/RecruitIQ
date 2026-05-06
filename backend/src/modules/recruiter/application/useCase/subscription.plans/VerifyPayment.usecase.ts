import crypto from "crypto";

import { ApplicationError } from "../../../../../shared/errors/application.error";

import { ERROR_CODES } from "../../constants/error.code.constants";

import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";

import { BillingRecordRepository } from "../../../domain/repositories/billing.repository";

import {
  SubscriptionStatus,
} from "../../../domain/entities/Recruitersubscription.entity";

import {
  BillingEventType,
  BillingStatus,
} from "../../../domain/entities/Billingrecord.entity";

export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
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

  async execute(
    request: VerifyPaymentRequest
  ): Promise<VerifyPaymentResponse> {

    console.log("\n========== VERIFY PAYMENT USE CASE ==========");

    console.log("VERIFY REQUEST:", request);

    console.log(
      "RAZORPAY KEY SECRET:",
      this.razorpayKeySecret
    );

   
    const payload = `${request.razorpay_payment_id}|${request.razorpay_subscription_id}`;

    console.log("SIGNATURE PAYLOAD:", payload);

   
    const generatedSignature = crypto
      .createHmac("sha256", this.razorpayKeySecret)
      .update(payload)
      .digest("hex");

    console.log(
      "GENERATED SIGNATURE:",
      generatedSignature
    );

    console.log(
      "RAZORPAY SIGNATURE:",
      request.razorpay_signature
    );

   
    if (
      generatedSignature !== request.razorpay_signature
    ) {
      console.error("INVALID PAYMENT SIGNATURE");

      throw new ApplicationError(
        ERROR_CODES.INVALID_PAYMENT_SIGNATURE
      );
    }

    console.log("SIGNATURE VERIFIED SUCCESSFULLY");

   
    const subscription =
      await this.subscriptionRepo.findByRazorpaySubscriptionId(
        request.razorpay_subscription_id
      );

    console.log("FOUND SUBSCRIPTION:", subscription);

    if (!subscription) {
      console.error("SUBSCRIPTION NOT FOUND");

      throw new ApplicationError(
        ERROR_CODES.SUBSCRIPTION_NOT_FOUND
      );
    }

   
    if (
      subscription.status === SubscriptionStatus.Active
    ) {
      console.log(
        "SUBSCRIPTION ALREADY ACTIVE"
      );

      return {
        success: true,
        subscriptionId: subscription.id,
        message: "Subscription already active",
      };
    }

   
    console.log("UPDATING SUBSCRIPTION STATUS...");

    await this.subscriptionRepo.updateStatus(
      subscription.id,
      SubscriptionStatus.Active
    );

    console.log(
      "SUBSCRIPTION STATUS UPDATED TO ACTIVE"
    );

   
    const existingBilling =
      await this.billingRepo.findByRazorpayPaymentId(
        request.razorpay_payment_id
      );

    console.log(
      "EXISTING BILLING RECORD:",
      existingBilling
    );

    if (!existingBilling) {

      console.log("CREATING BILLING RECORD...");

      await this.billingRepo.create({
        recruiterId: subscription.recruiterId,

        subscriptionId: subscription.id,

        planId: subscription.planId,

        planName: subscription.planName,

        amount: subscription.price,

        currency: subscription.currency,

        netAmount: subscription.price,

        razorpayPaymentId:
          request.razorpay_payment_id,

        razorpayOrderId:
          subscription.razorpayOrderId,

        eventType: BillingEventType.Subscription,

        status: BillingStatus.Paid,

        periodStart:
          subscription.currentPeriodStart,

        periodEnd:
          subscription.currentPeriodEnd,

        paidAt: new Date(),
      });

      console.log(
        "BILLING RECORD CREATED SUCCESSFULLY"
      );
    }

    console.log(
      "PAYMENT VERIFIED & SUBSCRIPTION ACTIVATED"
    );

    console.log(
      "============================================\n"
    );

    return {
      success: true,
      subscriptionId: subscription.id,
      message:
        "Payment verified and subscription activated",
    };
  }
}