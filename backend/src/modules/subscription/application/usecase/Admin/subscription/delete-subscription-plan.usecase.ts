import { ERROR_CODES } from "../../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";
import { DeleteSubscriptionRequestDTO } from "../../../dto/delete-subscription.dto";

export class DeleteSubscriptionPlanUseCase implements IUseCase<DeleteSubscriptionRequestDTO,void> {
  constructor(private readonly repo: SubscriptionPlanRepository) {}
  async execute(request : DeleteSubscriptionRequestDTO): Promise<void> {
    const existing = await this.repo.findById(request.planId);
    if (!existing) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }
    await this.repo.delete(request.planId);
  }
}
