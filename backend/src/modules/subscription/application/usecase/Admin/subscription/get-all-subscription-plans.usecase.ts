import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";
import { UseCase } from "../../../../../../shared/interfaces/usecase.interface";
import {
  GetAllPlansRequestDTO,
  GetAllPlansResponseDTO,
} from "../../../dto/get-all-plans.dto";

export class GetAllSubscriptionPlansUseCase implements UseCase<
  GetAllPlansRequestDTO,
  GetAllPlansResponseDTO
> {
  constructor(private readonly repo: SubscriptionPlanRepository) {}

  async execute(
    filter: GetAllPlansRequestDTO,
  ): Promise<GetAllPlansResponseDTO> {
    const { data, total } = await this.repo.findAll(filter);

    return {
      data,
      total,
    };
  }
}
