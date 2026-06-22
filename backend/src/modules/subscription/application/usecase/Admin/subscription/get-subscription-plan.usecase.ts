import { ERROR_CODES } from "../../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";
import { GetSubscriptionPlanRequestDTO } from "../../../dto/getSubscription.plan.dto";

export class GetSubscriptionPlanUseCase implements UseCase<
  GetSubscriptionPlanRequestDTO,
  SubscriptionPlan
> {
  constructor(private readonly repo: SubscriptionPlanRepository) {}

  async execute(
    request: GetSubscriptionPlanRequestDTO,
  ): Promise<SubscriptionPlan> {
    const plan = await this.repo.findById(request.planId);
    if (!plan) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    return plan;
  }
}
