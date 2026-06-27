import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { AnalyzeApplicationRequestDTO } from "../../../../job-application/application/dto/analyseJobpost.dto";
import { ApplicationAnalysisStatus } from "../../../../job-application/domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { UpgradeSubscriptionRequestDTO } from "../../dto/upgrade-subscription.dto";

export class UpgradeSubscriptionUseCase implements IUseCase<
  UpgradeSubscriptionRequestDTO,
  RecruiterSubscription
> {
  constructor(
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly applicationRepo: JobApplicationRepository,
    private readonly analyzeApplicationUC: IUseCase<
      AnalyzeApplicationRequestDTO,
      void
    >,
  ) {}

  async execute(
    request: UpgradeSubscriptionRequestDTO,
  ): Promise<RecruiterSubscription> {
    const currentSubscription =
      await this.subscriptionRepo.findActiveByRecruiter(request.recruiterId);

    if (!currentSubscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }

    const currentPlan = await this.planRepo.findById(
      currentSubscription.planId,
    );

    if (!currentPlan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    const newPlan = await this.planRepo.findById(request.newPlanId);

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
    endDate.setMonth(endDate.getMonth() + request.durationMonths);

    const upgradedSubscription = currentSubscription.update({
      planId: newPlan.id,
      planName: newPlan.name,
      planPrice: newPlan.price * request.durationMonths,
      planType: newPlan.planType,
      durationMonths: request.durationMonths,
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
          : newPlan.jobPostsPerMonth * request.durationMonths,
      screeningLimit:
        newPlan.screeningCredits === -1
          ? -1
          : newPlan.screeningCredits * request.durationMonths,
      aiScoreLimit:
        newPlan.aiScoreCredits === -1
          ? -1
          : newPlan.aiScoreCredits * request.durationMonths,
    });
    await this.subscriptionRepo.update(upgradedSubscription);

    const quotaExceededApplications =
      await this.applicationRepo.findByAnalysisStatus(
        request.recruiterId,
        ApplicationAnalysisStatus.QUOTA_EXCEEDED,
      );

    for (const application of quotaExceededApplications) {
      void this.analyzeApplicationUC
        .execute({
          applicationId: application.id,
        })
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
