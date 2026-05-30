
export interface SubscriberFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface SubscribersListItem {
    id : string;
    recruiterId : string;
    recruiterName : string;
    companyName : string;
    planName : string;
    status : string;
    startDate : Date;
    endDate : Date;
}

export interface PaginatedSubscribers {
  data: SubscribersListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminSubscriptionRepository {
  getSubscribers(
    filters: SubscriberFilters,
  ): Promise<PaginatedSubscribers>;
}