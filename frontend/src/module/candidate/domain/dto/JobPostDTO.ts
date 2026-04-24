import type { JobPost } from "../entities/jobPost";

export interface JobPostFilters {
  page?: number;
  limit?: number;
  search?: string;
  jobType?: string;
  isRemote?: boolean;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  department?: string;
}

export interface PaginatedJobPosts {
  data: JobPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
