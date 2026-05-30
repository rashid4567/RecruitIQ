import { RecruiterSubscriptionRepository } from "../../../../domain/repository/recruiter-subscription-plan-repository";

export interface GetSubscribersRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export class GetSubscribersUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(
    request: GetSubscribersRequest,
  ) {
    return await this.subscriptionRepo.findAll({
      page: request.page ?? 1,
      limit: request.limit ?? 10,
      search: request.search,
      status: request.status,
    });
  }
}