import { ERROR_CODES } from "../../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../../shared/errors/application.error";
import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";

export class ActiveSubscriptionPlanUseCase {
  constructor(private readonly repo: SubscriptionPlanRepository) {}

  async execute(planId: string): Promise<void> {
    const plan = await this.repo.findById(planId);

    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    const updated = plan.activate();
    await this.repo.update(updated);
  }
}
