import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";

import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { RenewSubscriptionRequestDTO } from "../../dto/renew-subscription.dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";

export class RenewSubscriptionUseCase implements IUseCase<
  RenewSubscriptionRequestDTO,
  RecruiterSubscription
> {
  constructor(
    private readonly repo: RecruiterSubscriptionRepository,
    private readonly planRepo: SubscriptionPlanRepository,
  ) {}

  async execute(
    request: RenewSubscriptionRequestDTO,
  ): Promise<RecruiterSubscription> {
    const subscription = await this.repo.findActiveByRecruiter(
      request.recruiterId,
    );

    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }

    const plan = await this.planRepo.findById(subscription.planId);

    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    const nextPeriodStart = new Date(subscription.currentPeriodEnd);
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + plan.billingInterval);
    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + plan.billingInterval);
    const renewed = subscription.renew(
      newEndDate,
      nextPeriodStart,
      nextPeriodEnd,
    );
    await this.repo.update(renewed);
    return renewed;
  }
}
