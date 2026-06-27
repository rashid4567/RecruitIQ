import type { PlanSource } from "./subscription-plan.types";

import type { SubscribersListItem } from "./subscriber.types";
import type { RawRecruiterSubscription } from "./RecruiterSubscription.types";

export interface PlanListApiResponse {
  success: boolean;
  message?: string;
  data: PlanSource[];
}

export interface PlanDetailApiResponse {
  success: boolean;
  message?: string;
  data: PlanSource | null;
}

export interface SingleSubscriptionApiResponse {
  success?: boolean;
  message?: string;
  data: RawRecruiterSubscription | null;
}

export interface PaginatedSubscriptionApiResponse {
  success?: boolean;
  message?: string;
  data: {
    data: RawRecruiterSubscription[];

    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ChangePlanApiResponse {
  success?: boolean;
  message?: string;

  data: {
    subscription: RawRecruiterSubscription;
    direction: string;
  };
}

export interface RawPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RawSubscribersResponse {
  data: SubscribersListItem[];
  pagination: RawPagination;
}
