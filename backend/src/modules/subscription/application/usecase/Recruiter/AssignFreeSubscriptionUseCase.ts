import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";

import {
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../../domain/entities/recruiter-subscription.entity";

import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";

export class AssignFreeSubscriptionUseCase {
  constructor(
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly recruiterSubscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(recruiterId: string): Promise<void> {
    const existing =
      await this.recruiterSubscriptionRepo.findActiveByRecruiter(
        recruiterId,
      );
    if (existing) {
      return;
    }

    const freePlan =
      await this.planRepo.findActiveFreePlan();
    if (!freePlan) {
      throw new ApplicationError(
        ERROR_CODES.SUBSCRIPTION_REQUIRED,
      );
    }

    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);

    const subscription = RecruiterSubscription.create({
      recruiterId,
      planId: freePlan.id,
      planName: freePlan.name,
      planPrice: freePlan.price,
      planType: freePlan.planType,
      paymentReferenceId: undefined,
      durationMonths: 1,
      status: SubscriptionStatus.Active,
      startDate: now,
      endDate,
      currentPeriodStart: now,
      currentPeriodEnd,
      autoRenew: true,
      cancelledAt: undefined,
      jobPostsUsed: 0,
      resumeDownloadedCount: 0,
      screeningUsed: 0,
      aiScoreUsed: 0,
      jobPostsLimit: freePlan.jobPostsPerMonth,
      resumeDownloadLimit: freePlan.ResumeDownload,
      screeningLimit: freePlan.screeningCredits,
      aiScoreLimit: freePlan.aiScoreCredits,
      jobPostActiveDays: freePlan.jobPostActiveDays,
      createdAt: now,
      updatedAt: now,
    });
    await this.recruiterSubscriptionRepo.save(subscription);
  }
}