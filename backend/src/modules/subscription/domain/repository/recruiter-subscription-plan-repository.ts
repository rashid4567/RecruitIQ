import { RecruiterSubscription } from "../entities/recruiter-subscription.entity";

export interface GetSubscribersParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface SubscribersListItem {
  id: string;
  recruiterId: string;
  recruiterName: string;
  companyName: string;
  planName: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

export interface PaginatedSubscribers {
  items: SubscribersListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecruiterSubscriptionRepository {
  save(subscription: RecruiterSubscription): Promise<RecruiterSubscription>;
  update(subscription: RecruiterSubscription): Promise<void>;
  findById(id: string): Promise<RecruiterSubscription | null>;
  findActiveByRecruiter(
    recruiterId: string,
  ): Promise<RecruiterSubscription | null>;
  findAll(params: GetSubscribersParams): Promise<PaginatedSubscribers>;
}
