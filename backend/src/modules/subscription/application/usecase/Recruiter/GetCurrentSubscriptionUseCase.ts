import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import {
  CurrentSubscriptionResponse,
  GetCurrentSubscriptionRequestDTO,
} from "../../dto/current.subscription.dto";
import { SubscriptionStatus } from "../../../domain/entities/recruiter-subscription.entity";
import { UpdateRecruiterSubscriptionStatusRequestDTO } from "../../../../recruiter/application/dto/updateRecruiterSubscriptionStatus.dto";
import { PlanType } from "../../../domain/entities/subscription-plan.entity";

export class GetCurrentSubscriptionUseCase
  implements
    UseCase<
      GetCurrentSubscriptionRequestDTO,
      CurrentSubscriptionResponse
    >
{
  constructor(
    private readonly repo: RecruiterSubscriptionRepository,
    private readonly subscriptionPlanRepo: SubscriptionPlanRepository,
    private readonly updateRecruiterSubscriptionStatusUC: UseCase<
      UpdateRecruiterSubscriptionStatusRequestDTO,
      void
    >,
  ) {}

  async execute(
    request: GetCurrentSubscriptionRequestDTO,
  ): Promise<CurrentSubscriptionResponse> {
    const subscription = await this.repo.findActiveByRecruiter(
      request.recruiterId,
    );

    if (!subscription) {
      const freePlan =
        await this.subscriptionPlanRepo.findByPlanType(PlanType.Free);

      if (!freePlan) {
        throw new ApplicationError(
          ERROR_CODES.SUBSCRIPTION_NOT_FOUND,
        );
      }

      return {
        id: "",
        planName: freePlan.name,
        planType: freePlan.planType,
        planPrice: freePlan.price,
        status: SubscriptionStatus.Active,
        isActive: true,

        startDate: null,
        endDate: null,
        nextBillingDate: null,

        jobPostsUsed: 0,
        resumeDownloadedCount: 0,

        jobPostsLimit: freePlan.jobPostsPerMonth,
        resumeDownloadLimit: freePlan.ResumeDownload ?? 0,
        jobPostActiveDays: freePlan.jobPostActiveDays,

        screeningUsed: 0,
        screeningLimit: freePlan.screeningCredits,

        aiScoreUsed: 0,
        aiScoreLimit: freePlan.aiScoreCredits,

        autoRenew: false,
      };
    }

    let currentSubscription = subscription;

    if (subscription.isExpired()) {
      currentSubscription = subscription.expire();

      await this.repo.update(currentSubscription);

      await this.updateRecruiterSubscriptionStatusUC.execute({
        recruiterId: request.recruiterId,
        status: "expired",
      });
    }

    return {
      id: currentSubscription.id,
      planName: currentSubscription.planName,
      planType: currentSubscription.planType,
      planPrice: currentSubscription.planPrice,
      status: currentSubscription.status,
      isActive:
        currentSubscription.status === SubscriptionStatus.Active,

      startDate: currentSubscription.startDate,
      endDate: currentSubscription.endDate,
      nextBillingDate: currentSubscription.endDate,

      jobPostsUsed: currentSubscription.jobPostsUsed,
      resumeDownloadedCount:
        currentSubscription.resumeDownloadedCount,

      jobPostsLimit: currentSubscription.jobPostsLimit,
      resumeDownloadLimit:
        currentSubscription.resumeDownloadLimit,

      jobPostActiveDays: currentSubscription.jobPostActiveDays,

      screeningUsed: currentSubscription.screeningUsed,
      screeningLimit: currentSubscription.screeningLimit,

      aiScoreUsed: currentSubscription.aiScoreUsed,
      aiScoreLimit: currentSubscription.aiScoreLimit,

      autoRenew: currentSubscription.autoRenew,
    };
  }
}