import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { AnalyzeApplicationUseCase } from "../../../../job-application/application/usecase/candidate/AnalyzeApplicationUseCase";
import { ApplicationAnalysisStatus } from "../../../../job-application/domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";

export class UpgradeSubscriptionUseCase {
  constructor(
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly applicationRepo: JobApplicationRepository,
    private readonly analyzeApplicationUC: AnalyzeApplicationUseCase,
  ) {}

  async execute(
    recruiterId: string,
    newPlanId: string,
    durationMonths: number,
  ) {
    const currentSubscription =
      await this.subscriptionRepo.findActiveByRecruiter(recruiterId);

    if (!currentSubscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }

    const currentPlan = await this.planRepo.findById(
      currentSubscription.planId,
    );

    if (!currentPlan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    const newPlan = await this.planRepo.findById(newPlanId);

    if (!newPlan || !newPlan.isActive) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    if (currentSubscription.planId === newPlan.id) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_ALREADY_EXISTS);
    }

    if (!currentPlan.canUpgradeTo(newPlan)) {
      throw new ApplicationError(ERROR_CODES.DOWNGRADE_NOT_ALLOWED);
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const upgradedSubscription = currentSubscription.update({
      planId: newPlan.id,
      planName: newPlan.name,
      planPrice: newPlan.price * durationMonths,
      planType: newPlan.planType,
      durationMonths,
      jobPostActiveDays: newPlan.jobPostActiveDays,
      startDate: now,
      endDate,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      jobPostsUsed: 0,
      screeningUsed: 0,
      aiScoreUsed: 0,
      jobPostsLimit:
        newPlan.jobPostsPerMonth === -1
          ? -1
          : newPlan.jobPostsPerMonth * durationMonths,
      screeningLimit:
        newPlan.screeningCredits === -1
          ? -1
          : newPlan.screeningCredits * durationMonths,
      aiScoreLimit:
        newPlan.aiScoreCredits === -1
          ? -1
          : newPlan.aiScoreCredits * durationMonths,
    });
    await this.subscriptionRepo.update(upgradedSubscription);

    const quotaExceededApplications =
      await this.applicationRepo.findByAnalysisStatus(
        recruiterId,
        ApplicationAnalysisStatus.QUOTA_EXCEEDED,
      );

    for (const application of quotaExceededApplications) {
      void this.analyzeApplicationUC
        .execute(application.id)
        .catch((error) =>
          console.error(
            `Failed to re-analyze application ${application.id}`,
            error,
          ),
        );
    }

    return upgradedSubscription;
  }
}
