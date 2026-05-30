import api from "@/api/axios";
import type {
  AdminSubscriptionRepository,
  PaginatedSubscribers,
  SubscriberFilters,
  SubscribersListItem,
} from "../../domain/repositories/subscribers.plan.repository";

interface RawSubscriptionItem {
  id: string;
  recruiterId: string;
  recruiterName: string;
  companyName: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface RawPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RawSubscribersResponse {
  data: RawSubscriptionItem[];
  pagination: RawPagination;
}

export class ApiAdminSubscriptionRepository implements AdminSubscriptionRepository {
  async getSubscribers(
    filters: SubscriberFilters,
  ): Promise<PaginatedSubscribers> {
    const response = await api.get<RawSubscribersResponse>(
      "/admin/subscribers",
      {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search,
          status: filters.status,
        },
      },
    );

    const { data, pagination } = response.data;
    console.log("data :-", data);
    return {
      data: data.map(
        (item): SubscribersListItem => ({
          id: item.id,
          recruiterId: item.recruiterId,
          recruiterName: item.recruiterName,
          companyName: item.companyName,
          planName: item.planName,
          status: item.status,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
        }),
      ),

      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
    };
  }
}
