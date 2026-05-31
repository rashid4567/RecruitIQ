import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { CurrentSubscriptionResponse } from "../../dto/current.subscription.dto";
import { SubscriptionStatus } from "../../../domain/entities/recruiter-subscription.entity";

export class GetCurrentSubscriptionUseCase {
  constructor(
    private readonly repo: RecruiterSubscriptionRepository,
  ) {}

  async execute(
    recruiterId: string,
  ): Promise<CurrentSubscriptionResponse> {
    const subscription =
      await this.repo.findActiveByRecruiter(recruiterId);

    if (!subscription) {
      throw new ApplicationError(
        ERROR_CODES.SUBSCRIPTION_NOT_FOUND,
      );
    }

    return {
      id: subscription.id,
      planName: subscription.planName,
      planType: subscription.planType,
      planPrice: subscription.planPrice,
      status: subscription.status,
      isActive:
        subscription.status ===
        SubscriptionStatus.Active,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      nextBillingDate: subscription.endDate,
      jobPostsUsed: subscription.jobPostsUsed,
      jobPostsLimit: subscription.jobPostsLimit,
      jobPostActiveDays : subscription.jobPostActiveDays,
      screeningUsed: subscription.screeningUsed,
      screeningLimit: subscription.screeningLimit,
      resumeUsed: subscription.resumeUsed,
      resumeLimit: subscription.resumeLimit,
      aiScoreUsed: subscription.aiScoreUsed,
      aiScoreLimit: subscription.aiScoreLimit,
      autoRenew: subscription.autoRenew,
    };
  }
}