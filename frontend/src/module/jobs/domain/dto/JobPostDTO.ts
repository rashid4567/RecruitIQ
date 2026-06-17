import type { Job } from "../entity/jobPost.entity";
import type { JobType, JobStatus } from "./jobPost.dto";

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
  location ?: string;
}

export interface PaginatedJobPosts {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}