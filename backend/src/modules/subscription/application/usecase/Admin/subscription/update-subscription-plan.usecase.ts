import { ERROR_CODES } from "../../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../../shared/errors/application.error";
import { UpdateSubscriptionPlanRequestDTO } from "../../../dto/update-input.dto";
import {
  SubscriptionPlan,
  SubscriptionPlanProps,
} from "../../../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";

export class UpdateSubscriptionPlanUseCase implements IUseCase<
  UpdateSubscriptionPlanRequestDTO,
  SubscriptionPlan
> {
  constructor(private readonly repo: SubscriptionPlanRepository) {}

  async execute(
    request: UpdateSubscriptionPlanRequestDTO,
  ): Promise<SubscriptionPlan> {
    const existing = await this.repo.findById(request.planId);
    if (!existing) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    const updated = existing.update({
      ...request.data,
    } as Partial<SubscriptionPlanProps>);
    await this.repo.update(updated);
    return updated;
  }
}
