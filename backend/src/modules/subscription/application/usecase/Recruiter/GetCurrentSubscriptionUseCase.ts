import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { CurrentSubscriptionResponse } from "../../dto/current.subscription.dto";
import { SubscriptionStatus } from "../../../domain/entities/recruiter-subscription.entity";
import { UpdateRecruiterSubscriptionStatusUseCase } from "../../../../recruiter/application/useCase/profile/UpdateRecruiterSubscriptionStatusUseCase";

export class GetCurrentSubscriptionUseCase {
  constructor(
    private readonly repo: RecruiterSubscriptionRepository,
    private readonly updateRecruiterSubscriptionStatusUC: UpdateRecruiterSubscriptionStatusUseCase,
  ) {}

  async execute(recruiterId: string): Promise<CurrentSubscriptionResponse> {
    const subscription = await this.repo.findActiveByRecruiter(recruiterId);

    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }

    let currentSubscription = subscription;
    if (subscription.isExpired()) {
      currentSubscription = subscription.expire();
      await this.repo.save(currentSubscription);
      await this.updateRecruiterSubscriptionStatusUC.execute(
        recruiterId,
        "expired",
      );
    }

    return {
      id: currentSubscription.id,
      planName: currentSubscription.planName,
      planType: currentSubscription.planType,
      planPrice: currentSubscription.planPrice,
      status: currentSubscription.status,
      isActive: currentSubscription.status === SubscriptionStatus.Active,
      startDate: currentSubscription.startDate,
      endDate: currentSubscription.endDate,
      nextBillingDate: currentSubscription.endDate,
      jobPostsUsed: currentSubscription.jobPostsUsed,
      jobPostsLimit: currentSubscription.jobPostsLimit,
      jobPostActiveDays: currentSubscription.jobPostActiveDays,
      screeningUsed: currentSubscription.screeningUsed,
      screeningLimit: currentSubscription.screeningLimit,

      aiScoreUsed: currentSubscription.aiScoreUsed,
      aiScoreLimit: currentSubscription.aiScoreLimit,
      autoRenew: currentSubscription.autoRenew,
    };
  }
}
