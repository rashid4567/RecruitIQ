import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { PaymentGateway } from "../../../recruiter/application/ports/Paymentgateway.port";
import { RecruiterSubscriptionRepository } from "../../../recruiter/domain/repositories/recruiter-subscription.repository";
import { SubscriptionPlanRepository } from "../../../subscription/domain/repository/subscription-plan.repository";
import {
  Payment,
  PaymentStatus,
  PaymentType,
} from "../../domain/entity/payment.entity";
import { PaymentRepository } from "../../domain/repository/payment.repository";

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
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    if (plan.isFree()) {
      throw new ApplicationError(
        ERROR_CODES.FREE_PLAN_DOES_NOT_REQUIRE_PAYMENT,
      );
    }

    const razorpayOrder = await this.paymentGateway.createOrder({
      amount: plan.price,
      currency: plan.currency,
      receipt: `PAY_${Date.now()}`,
      notes: {
        recruiterId: request.recruiterId,
        planId: plan.id,
        planName: plan.name,
      },
    });

    const payment = Payment.create({
      id: crypto.randomUUID(),
      recruiterId: request.recruiterId,
      planId: plan.id,
      paymentType: PaymentType.Subscription,
      amount: plan.price,
      tax: 0,
      discount: 0,
      netAmount: plan.price,
      currency: plan.currency,
      status: PaymentStatus.Pending,
      razorpayOrderId: razorpayOrder.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.paymentRepo.create(payment);
    return {
      paymentId: saved.id,
      orderId: razorpayOrder.id,
      razorpayKeyId: this.razorpayKeyId,
      amount: plan.price,
      currency: plan.currency,
      planName: plan.name,
      paymentType: PaymentType.Subscription,
    };
  }
}
