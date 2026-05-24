import { ApplicationError } from "../../../../../shared/errors/application.error";
import {
  CancellationReason,
  RecruiterSubscription,
} from "../../../domain/entities/Recruitersubscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { SubscriptionPlanRepository } from "../../../domain/repositories/Subscription.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface ChangePlanRequest {
  recruiterId: string;
  newPlanId: string;
  newEndDate: Date;
  newRazorpaySubscriptionId?: string;
}

export type ChangePlanDirection = "upgrade" | "downgrade" | "same";

export interface ChangePlanResponse {
  subscription: RecruiterSubscription;
  direction: ChangePlanDirection;
}




export class ChangePlanUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly planRepo: SubscriptionPlanRepository,
  ) {}

  async execute(request: ChangePlanRequest): Promise<ChangePlanResponse> {
    const current = await this.subscriptionRepo.findActiveByRecruiterId(
      request.recruiterId,
    );
    if (!current) {
  throw new ApplicationError(
    ERROR_CODES.NO_ACTIVE_SUBSCRIPTION_FOUND_FOR_THIS_RECRUITER
  );
}
    const newPlan = await this.planRepo.findById(request.newPlanId);
   if (!newPlan || !newPlan.isActive) {
  throw new ApplicationError(
    ERROR_CODES.SUBSCRIPTION_PLAN_NOT_FOUND_OR_INACTIVE
  );
}
    if (current.planId === newPlan.id) {
  throw new ApplicationError(
    ERROR_CODES.SUBSCRIPTION_ALREADY_ON_THIS_PLAN
  );
}
    const currentPlan = await this.planRepo.findById(current.planId);
    let direction: ChangePlanDirection = "same";
    if (currentPlan) {
      direction = newPlan.isHigherThan(currentPlan) ? "upgrade" : "downgrade";
    }

    const changeReason =
      direction === "upgrade"
        ? CancellationReason.Upgraded
        : CancellationReason.Downgraded;

    const subscription = await this.subscriptionRepo.changePlan({
      subscriptionId: current.id,
      newPlanId: newPlan.id,
      newPlanName: newPlan.name,
      newPlanType: newPlan.planType,
      newPrice: newPlan.price,
      newCurrency: newPlan.currency,
      newBillingCycle: newPlan.billingCycle,
      newJobPostsLimit: newPlan.jobPostsPerMonth,
      newScreeningCreditsLimit: newPlan.screeningCredits,
      newEndDate: request.newEndDate,
      newRazorpaySubscriptionId: request.newRazorpaySubscriptionId,
      changeReason,
    });

    return { subscription, direction };
  }
}
