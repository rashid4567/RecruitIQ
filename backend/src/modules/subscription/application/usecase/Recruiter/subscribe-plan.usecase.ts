import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import {
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../../domain/entities/recruiter-subscription.entity";

export class SubscribePlanUseCase {
  constructor(
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly recruiterRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(
    recruiterId: string,
    planId: string,
  ): Promise<RecruiterSubscription> {
    const plan = await this.planRepo.findById(planId);
    if (!plan || !plan.isActive) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    if (!plan.isFree()) {
      throw new ApplicationError(
        ERROR_CODES.FREE_PLAN_DOES_NOT_REQUIRE_PAYMENT,
      );
    }
    const existing =
      await this.recruiterRepo.findActiveByRecruiter(recruiterId);
    if (existing) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_ALREADY_EXISTS);
    }

    const durationMonths = 1;
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    const subscription = RecruiterSubscription.create({
      recruiterId,
      planId: plan.id,
      planName: plan.name,
      planPrice: plan.price,
      planType: plan.planType,
      durationMonths,
      jobPostActiveDays: plan.jobPostActiveDays,
      paymentReferenceId: undefined,
      status: SubscriptionStatus.Active,
      startDate,
      endDate,
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
      autoRenew: false,
      cancelledAt: undefined,
      jobPostsUsed: 0,
      screeningUsed: 0,
      aiScoreUsed: 0,
      jobPostsLimit:
        plan.jobPostsPerMonth === -1
          ? -1
          : plan.jobPostsPerMonth * durationMonths,
      screeningLimit:
        plan.screeningCredits === -1
          ? -1
          : plan.screeningCredits * durationMonths,
      aiScoreLimit:
        plan.aiScoreCredits === -1 ? -1 : plan.aiScoreCredits * durationMonths,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.recruiterRepo.save(subscription);
    return subscription;
  }
}
