import { randomUUID } from "crypto";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { SubscriptionPlanRepository } from "../../domain/repository/subscription-plan.repository";
import { RecruiterSubscriptionRepository } from "../../domain/repository/recruiter-subscription-plan-repository";
import {
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../domain/entities/recruiter-subscription.entity";

export class SubscribePlanUseCase {
  constructor(
    private readonly planRepo: SubscriptionPlanRepository,
    private readonly recruiterRepo: RecruiterSubscriptionRepository,
  ) {}
  async execute(recruiterId: string, planId: string) {
    const plan = await this.planRepo.findById(planId);
    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    const existing =
      await this.recruiterRepo.findActiveByRecruiter(recruiterId);
    if (existing) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_ALREADY_EXISTS);
    }
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.billingInterval);
    const subscription = RecruiterSubscription.create({
      id: randomUUID(),
      recruiterId,
      planId: plan.id,
      startDate,
      endDate,
      autoRenew: false,
      status: SubscriptionStatus.Active,
      cancelledAt: undefined,
      jobPostsUsed: 0,
      screeningUsed: 0,
      resumeUsed: 0,
      aiScoreUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.recruiterRepo.save(subscription);
    return subscription;
  }
}
