import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";

export class UpgradeSubscriptionUseCase {
  constructor(
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(recruiterId: string, newPlanId: string) {
    const currentSubscription =
      await this.subscriptionRepo.findActiveByRecruiter(recruiterId);

    if (!currentSubscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }

    const newPlan = await this.planRepo.findById(newPlanId);

    if (!newPlan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    if (currentSubscription.planId === newPlan.id) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_ALREADY_EXISTS);
    }

    if (newPlan.price <= currentSubscription.planPrice) {
      throw new ApplicationError(ERROR_CODES.DOWNGRADE_NOT_ALLOWED);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + newPlan.billingInterval);

    const upgradedSubscription = currentSubscription.update({
      planId: newPlan.id,
      planName: newPlan.name,
      planPrice: newPlan.price,
      planType: newPlan.planType,
      jobPostActiveDays: newPlan.jobPostActiveDays,

      jobPostsLimit: newPlan.jobPostsPerMonth,
      screeningLimit: newPlan.screeningCredits,
      resumeLimit: newPlan.resumeParsesPerMonth,
      aiScoreLimit: newPlan.aiScoreCredits,
    });

    await this.subscriptionRepo.update(upgradedSubscription);

    return upgradedSubscription;
  }
}
