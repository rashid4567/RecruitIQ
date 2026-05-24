import { ApplicationError } from "../../../../../shared/errors/application.error";
import { SubscriptionPlan } from "../../../domain/entities/Subscriptionplan.entity";
import { SubscriptionPlanRepository } from "../../../domain/repositories/Subscription.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface GetPlanDetailsRequest {
  planId: string;
}

export type GetPlanDetailResponse = SubscriptionPlan;

export class GetPlanDetailUseCase {
  constructor(private readonly subscriptionRepop: SubscriptionPlanRepository) {}

  async execute(
    request: GetPlanDetailsRequest,
  ): Promise<GetPlanDetailResponse> {
    const plan = await this.subscriptionRepop.findById(request.planId);

    if (!plan) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_PLAN_NOT_FOUND);
    }

    if (!plan.isActive) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_PLAN_NOT_ACTIVE);
    }

    return plan;
  }
}
