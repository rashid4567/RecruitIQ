import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { RecruiterSubscriptionRepository } from "../../../../domain/repository/recruiter-subscription-plan-repository";
import {
  GetSubscribersRequestDTO,
  GetSubscribersResponseDTO,
} from "../../../dto/get-subscribers.dto";

export class GetSubscribersUseCase implements IUseCase<
  GetSubscribersRequestDTO,
  GetSubscribersResponseDTO
> {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(
    request: GetSubscribersRequestDTO,
  ): Promise<GetSubscribersResponseDTO> {
    return this.subscriptionRepo.findAll({
      page: request.page ?? 1,
      limit: request.limit ?? 10,
      search: request.search,
      status: request.status,
    });
  }
}
