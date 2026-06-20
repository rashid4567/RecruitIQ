import {
  Payment,
  PaymentStatus,
  PaymentType,
} from "../../../domain/entities/payment.entity";
import { PaymentRepository } from "../../../domain/repository/payment.repository";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { PaymentGateway } from "../../ports/Paymentgateway.port";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { IdGenerator } from "../../ports/id-generator.port";

export interface CreatePaymentOrderRequest {
  recruiterId: string;
  planId: string;
  durationMonths: number;
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
    private readonly idGenerator: IdGenerator,
    private readonly razorpayKeyId: string,
  ) {}

  async execute(
    request: CreatePaymentOrderRequest,
  ): Promise<CreatePaymentOrderResponse> {
    const activeSubscription =
      await this.subscriptionRepo.findActiveByRecruiter(request.recruiterId);

    const plan = await this.planRepo.findById(request.planId);

    if (!plan || !plan.isActive) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    if (plan.isFree()) {
      throw new ApplicationError(
        ERROR_CODES.FREE_PLAN_DOES_NOT_REQUIRE_PAYMENT,
      );
    }

    if (request.durationMonths < 1 || request.durationMonths > 12) {
      throw new ApplicationError(ERROR_CODES.INVALID_SUBSCRIPTION_DURATION);
    }

    let paymentType = PaymentType.Subscription;

    if (activeSubscription) {
      if (activeSubscription.planId === plan.id) {
        throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_ALREADY_EXISTS);
      }

      if (plan.price <= activeSubscription.planPrice) {
        throw new ApplicationError(ERROR_CODES.DOWNGRADE_NOT_ALLOWED);
      }

      paymentType = PaymentType.Upgrade;
    }

    const amount = plan.price * request.durationMonths;

    const paymentId = this.idGenerator.generate();

    const razorpayOrder = await this.paymentGateway.createOrder({
      amount,
      currency: plan.currency,
      receipt: paymentId,
      notes: {
        recruiterId: request.recruiterId,
        planId: plan.id,
        planName: plan.name,
        durationMonths: request.durationMonths,
        paymentType,
      },
    });

    const payment = Payment.create({
      id: paymentId,
      recruiterId: request.recruiterId,
      planId: plan.id,
      durationMonths: request.durationMonths,
      paymentType,
      amount,
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
      amount,
      currency: plan.currency,
      planName: plan.name,
      paymentType,
    };
  }
}
