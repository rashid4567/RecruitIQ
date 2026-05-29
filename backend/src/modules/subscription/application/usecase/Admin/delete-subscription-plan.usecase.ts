import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { SubscriptionPlanRepository } from "../../../domain/repository/subscription-plan.repository";

export class DeleteSubscriptionPlanUseCase {
  constructor(private readonly repo: SubscriptionPlanRepository) {}
  async execute(planId: string): Promise<void> {
    const existing = await this.repo.findById(planId);
    if (!existing) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    await this.repo.delete(planId);
  }
}
