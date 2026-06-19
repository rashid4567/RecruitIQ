import { BaseRepository } from "../../../../shared/repositories/base.repository";
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
  profileImage?: string;
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

export interface RecruiterSubscriptionRepository extends BaseRepository<RecruiterSubscription> {
  save(subscription: RecruiterSubscription): Promise<RecruiterSubscription>;
  update(subscription: RecruiterSubscription): Promise<void>;
  findActiveByRecruiter(
    recruiterId: string,
  ): Promise<RecruiterSubscription | null>;
  findAll(params: GetSubscribersParams): Promise<PaginatedSubscribers>;
  consumeAIScoreIfAvailable(recruiterId: string): Promise<boolean>;
}
