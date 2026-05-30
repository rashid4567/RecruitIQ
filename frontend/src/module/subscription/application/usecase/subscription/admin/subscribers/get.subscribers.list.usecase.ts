import type { AdminSubscriptionRepository } from "@/module/subscription/domain/repositories/subscribers.plan.repository";

export interface GetSubscribersRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export class GetSubscribersUseCase {
     private readonly repo: AdminSubscriptionRepository;
  constructor(
   repo: AdminSubscriptionRepository
  ) {
    this.repo = repo;
  }

  async execute(
    request: GetSubscribersRequest,
  ) {
    return this.repo.getSubscribers(request);
  }
}