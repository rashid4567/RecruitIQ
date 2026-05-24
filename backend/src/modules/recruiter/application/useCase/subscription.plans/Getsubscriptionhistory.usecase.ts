

import { RecruiterSubscription } from "../../../domain/entities/Recruitersubscription.entity";
import { PaginatedResult, PaginationOptions, RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";


export interface GetSubscriptionHistoryRequest {
  recruiterId: string;
  pagination?: PaginationOptions;
}

export type GetSubscriptionHistoryResponse = PaginatedResult<RecruiterSubscription>;

export class GetSubscriptionHistoryUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(
    request: GetSubscriptionHistoryRequest,
  ): Promise<GetSubscriptionHistoryResponse> {
    const pagination: PaginationOptions = {
      page:  request.pagination?.page  ?? 1,
      limit: request.pagination?.limit ?? 10,
    };

    return this.subscriptionRepo.findAllByRecruiterId(
      request.recruiterId,
      pagination,
    );
  }
}