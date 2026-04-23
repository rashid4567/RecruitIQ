import type { JobStatus, JobType } from "../entities/jobpost.entity";

export interface JobPostQuery {
  page: number;
  limit: number;
  search?: string;
  status?: JobStatus;
  isBlocked?: boolean;
  jobType?: JobType;
  recruiterId?: string;
  location?: string;
  postedAfter?: string;
  postedBefore?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
}