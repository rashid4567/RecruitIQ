import { JobStatus } from "../entities/job.entity";
import { JobType } from "../entities/job.entity";

export interface JobFilters {
  recruiterId?: string;
  search?: string;
  status?: JobStatus;
  jobType?: JobType;
  isBlocked?: boolean;
  includeDeleted?: boolean;
  department?: string;
  isRemote?: boolean;
  requiredSkills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  forCandidate?: boolean;
  forAdmin?: boolean;
}

export interface PaginationOptions {
  page:number;
  limit:number;
}

export type SortField =
  | "createdAt"
  | "updatedAt"
  | "postedOn"
  | "views"
  | "applicationsCount"
  | "title"
  | "salary";

export interface SortOptions {
  field: SortField;
  order:"asc" | "desc";
}

export interface PaginatedResult<T>{
  data:T[];
  total:number;
  page:number;
  limit:number;
  totalPages:number;
}