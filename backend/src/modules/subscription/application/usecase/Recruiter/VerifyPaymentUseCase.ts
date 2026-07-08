import { PaymentType } from "../../../domain/entities/payment.entity";
import { PaymentRepository } from "../../../domain/repository/payment.repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { PaymentGateway } from "../../ports/Paymentgateway.port";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import {
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../../domain/entities/recruiter-subscription.entity";
import { NotificationType } from "../../../../notification/infrastructure/mongoose/notification.model";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpdateRecruiterSubscriptionStatusRequestDTO } from "../../../../recruiter/application/dto/updateRecruiterSubscriptionStatus.dto";
import { UpgradeSubscriptionRequestDTO } from "../../dto/upgrade-subscription.dto";
import { CreateNotificationRequest } from "../../../../notification/application/dto/createNotification.dto";
import { Notification } from "../../../../notification/domain/entities/Notification";
import {
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
} from "../../dto/verifyPayment.dto";

export class VerifyPaymentUseCase implements IUseCase<
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO
> {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly upgradeSubscriptionUC: IUseCase<
      UpgradeSubscriptionRequestDTO,
      RecruiterSubscription
    >,
    private readonly updateRecruiterSubscriptionStatusUC: IUseCase<
      UpdateRecruiterSubscriptionStatusRequestDTO,
      void
    >,
    private readonly createNotificationUC: IUseCase<
      CreateNotificationRequest,
      Notification
    >,
  ) {}

  async execute(
    request: VerifyPaymentRequestDTO,
  ): Promise<VerifyPaymentResponseDTO> {
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

    if (payment.paymentType === PaymentType.Upgrade) {
      const upgradedSubscription = await this.upgradeSubscriptionUC.execute({
        recruiterId: payment.recruiterId,
        newPlanId: payment.planId,
        durationMonths: payment.durationMonths,
      });

      await this.updateRecruiterSubscriptionStatusUC.execute({
        recruiterId: payment.recruiterId,
        status: "active",
      });

      try {
        await this.createNotificationUC.execute({
          recipientId: payment.recruiterId,
          recipientRole: "recruiter",
          title: "Subscription Upgraded",
          message: "Your subscription has been upgraded successfully.",
          type: NotificationType.SUBSCRIPTION_UPGRADED,
          actionUrl: "/recruiter/subscription",
          referenceId: upgradedSubscription.id,
          metadata: {
            subscriptionId: upgradedSubscription.id,
            planId: payment.planId,
          },
        });
      } catch (err) {
        console.error("SUBSCRIPTION_UPGRADE notification failed:", err);
      }

      const paidPayment = payment
        .markPaid(request.razorpayPaymentId)
        .attachSubscription(upgradedSubscription.id);

      await this.paymentRepo.update(paidPayment);

      return {
        subscriptionId: upgradedSubscription.id,
        paymentId: paidPayment.id,
        status: "success",
      };
    }

    const plan = await this.planRepo.findById(payment.planId);

    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    const now = new Date();
    const endDate = new Date(now);

    endDate.setMonth(endDate.getMonth() + payment.durationMonths);

    const subscription = RecruiterSubscription.create({
      recruiterId: payment.recruiterId,
      planId: plan.id,
      planName: plan.name,
      planPrice: payment.amount,
      planType: plan.planType,
      durationMonths: payment.durationMonths,
      jobPostActiveDays: plan.jobPostActiveDays,
      paymentReferenceId: payment.id,
      status: SubscriptionStatus.Active,
      startDate: now,
      endDate,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      autoRenew: false,
      jobPostsUsed: 0,
      resumeDownloadedCount : 0,
      screeningUsed: 0,
      aiScoreUsed: 0,

      jobPostsLimit:
        plan.jobPostsPerMonth === -1
          ? -1
          : plan.jobPostsPerMonth * payment.durationMonths,
      screeningLimit:
        plan.screeningCredits === -1
          ? -1
          : plan.screeningCredits * payment.durationMonths,

      aiScoreLimit:
        plan.aiScoreCredits === -1
          ? -1
          : plan.aiScoreCredits * payment.durationMonths,

      createdAt: now,
      updatedAt: now,
    });

    const savedSubscription = await this.subscriptionRepo.save(subscription);

    await this.updateRecruiterSubscriptionStatusUC.execute({
      recruiterId: payment.recruiterId,
      status: "active",
    });

    try {
      await this.createNotificationUC.execute({
        recipientId: payment.recruiterId,
        recipientRole: "recruiter",
        title: "Subscription Activated",
        message: "Your subscription has been activated successfully.",
        type: NotificationType.SUBSCRIPTION_CREATED,
        actionUrl: "/recruiter/subscription",
        referenceId: savedSubscription.id,
        metadata: {
          subscriptionId: savedSubscription.id,
          planId: plan.id,
        },
      });
    } catch (err) {
      console.error("SUBSCRIPTION_CREATED notification failed:", err);
    }

    const paidPayment = payment
      .markPaid(request.razorpayPaymentId)
      .attachSubscription(savedSubscription.id);

    await this.paymentRepo.update(paidPayment);

    return {
      subscriptionId: savedSubscription.id,
      paymentId: paidPayment.id,
      status: "success",
    };
  }
}
