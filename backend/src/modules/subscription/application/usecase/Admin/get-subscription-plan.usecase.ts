import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { SubscriptionPlan } from "../../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";

export class GetSubscriptionPlanUseCase {
  constructor(private readonly repo: SubscriptionPlanRepository) {}

  async execute(planId: string): Promise<SubscriptionPlan> {
    const plan = await this.repo.findById(planId);
    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    return plan;
  }
}
