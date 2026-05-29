import crypto from "crypto";
import { Payment, PaymentStatus, PaymentType } from "../../../domain/entities/payment.entity";
import { PaymentRepository } from "../../../domain/repository/payment.repository";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { PaymentGateway } from "../../ports/Paymentgateway.port";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";



export interface CreatePaymentOrderRequest {
  recruiterId: string;
  planId: string;
}

export interface CreatePaymentOrderResponse {
  paymentId: string;
  orderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  planName: string;
  paymentType: PaymentType;
}

export class CreatePaymentOrderUseCase {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly razorpayKeyId: string,
  ) {}
  async execute(
    request: CreatePaymentOrderRequest,
  ): Promise<CreatePaymentOrderResponse> {
    const activeSubscription =
      await this.subscriptionRepo.findActiveByRecruiter(
        request.recruiterId,
      );
    if (activeSubscription) {
      throw new ApplicationError(
        ERROR_CODES.ACTIVE_SUBSCRIPTION_ALREADY_EXISTS,
      );
    }
    const plan = await this.planRepo.findById(
      request.planId,
    );
    if (!plan || !plan.isActive) {
      throw new ApplicationError(
        ERROR_CODES.PLAN_NOT_FOUND,
      );
    }
    if (plan.isFree()) {
      throw new ApplicationError(
        ERROR_CODES.FREE_PLAN_DOES_NOT_REQUIRE_PAYMENT,
      );
    }

    const paymentId = crypto.randomUUID();
    const razorpayOrder =
      await this.paymentGateway.createOrder({
        amount: plan.price,
        currency: plan.currency,
        receipt: paymentId,
        notes: {
          recruiterId: request.recruiterId,
          planId: plan.id,
          planName: plan.name,
        },
      });

    const payment = Payment.create({
      id: paymentId,
      recruiterId: request.recruiterId,
      planId: plan.id,
      paymentType: PaymentType.Subscription,
      amount: plan.price,
      currency: plan.currency,
      status: PaymentStatus.Pending,
      razorpayOrderId: razorpayOrder.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.paymentRepo.save(payment);
    return {
      paymentId,
      orderId: razorpayOrder.id,
      razorpayKeyId: this.razorpayKeyId,
      amount: plan.price,
      currency: plan.currency,
      planName: plan.name,
      paymentType: PaymentType.Subscription,
    };
  }
}