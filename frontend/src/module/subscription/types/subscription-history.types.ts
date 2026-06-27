import type { RawRecruiterSubscription } from "./RecruiterSubscription.types";


export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RawPaginatedSubscriptions {
  data: RawRecruiterSubscription[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}