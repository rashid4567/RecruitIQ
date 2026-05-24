import type { RecruiterSubscription } from "@/module/recruiter/Domain/entities/RecruiterSubscription.entity";
import type {
  PaginatedResult,
  PaginationOptions,
  RecruiterSubscriptionRepository,
} from "@/module/recruiter/Domain/repositories/recruiter-subscription.repository";

export interface GetSubscriptionHistoryRequest {
  pagination?: PaginationOptions;
}

export type GetSubscriptionHistoryResponse =
  PaginatedResult<RecruiterSubscription>;

export class GetSubscriptionHistoryUseCase {
  private readonly subscriptionRepo: RecruiterSubscriptionRepository;
  constructor(subscriptionRepo: RecruiterSubscriptionRepository) {
    this.subscriptionRepo = subscriptionRepo;
  }

  async execute(
    request: GetSubscriptionHistoryRequest,
  ): Promise<GetSubscriptionHistoryResponse> {
    const pagination: PaginationOptions = {
      page: request.pagination?.page ?? 1,
      limit: request.pagination?.limit ?? 10,
    };

    return this.subscriptionRepo.getSubscriptionHistory(pagination);
  }
}
