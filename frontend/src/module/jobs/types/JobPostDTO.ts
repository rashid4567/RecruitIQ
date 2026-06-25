import type { Job } from "./job.types";
import type { JobStatus, JobType } from "./jobPost.dto";

export interface JobPostFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatus;
  isBlocked?: boolean;
  jobType?: JobType;
  isRemote?: boolean;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  department?: string;
  location?: string;
}

export interface PaginatedJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}