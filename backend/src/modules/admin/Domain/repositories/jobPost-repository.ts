import { JobPost, JobStatus, JobType } from "../entities/jobPost-entity";

export interface AdminJobPostFilters {
  search?: string;
  status?: JobStatus;
  isBlocked?: boolean;
  jobType?: JobType;
  recruiterId?: string;
  location?: string;
  postedAfter?: Date;
  postedBefore?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export type SortField =
  | "createdAt"
  | "postedOn"
  | "applicationsCount"
  | "views"
  | "title";

export interface SortOptions {
  field: SortField;
  order: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobPostRepostory {
  findAll(
    filters: AdminJobPostFilters,
    pagination: PaginationOptions,
    sort: SortField,
    includeDelete?: boolean,
  ): Promise<PaginatedResult<JobPost>>;
  findById(id: string): Promise<JobPost | null>;
  updateStatus(id: string, isBlocked: boolean): Promise<JobPost>;
}
