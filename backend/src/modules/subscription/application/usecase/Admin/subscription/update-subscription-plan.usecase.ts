import { ERROR_CODES } from "../../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../../shared/errors/application.error";
import { UpdatePlanInput } from "../../../dto/update-input.dto";
import { SubscriptionPlanProps } from "../../../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";

export class UpdateSubscriptionPlanUseCase {
  constructor(private readonly repo: SubscriptionPlanRepository) {}

  async execute(planId: string, input: UpdatePlanInput) {
    const existing = await this.repo.findById(planId);
    if (!existing) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    const updated = existing.update({
      ...input,
    } as Partial<SubscriptionPlanProps>);
    await this.repo.update(updated);
    return updated;
  }
}
