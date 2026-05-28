import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../constants/errorcode.constants";

import { RecruiterSubscriptionRepository } from "../../domain/repository/recruiter-subscription-plan-repository";

import { SubscriptionPlanRepository } from "../../domain/repository/subscription-plan.repository";

export class RenewSubscriptionUseCase {
  constructor(
    private readonly repo: RecruiterSubscriptionRepository,
    private readonly planRepo: SubscriptionPlanRepository,
  ) {}

  async execute(recruiterId: string) {
    const subscription = await this.repo.findActiveByRecruiter(recruiterId);
    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }
    const plan = await this.planRepo.findById(subscription.planId);
    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + plan.billingInterval);
    const renewed = subscription.renew(newEndDate);
    await this.repo.update(renewed);
    return renewed;
  }
}
