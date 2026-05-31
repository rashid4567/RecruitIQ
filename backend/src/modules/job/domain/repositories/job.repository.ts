import { Job } from "../entities/job.entity";

import {
  JobFilters,
  PaginationOptions,
  PaginatedResult,
  SortOptions,
} from "../types/job-filter.type";

export interface JobRepository {
  create(job: Job): Promise<Job>;
  save(job: Job): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findAll(
    filters: JobFilters,
    pagination: PaginationOptions,
    sort?: SortOptions,
  ): Promise<PaginatedResult<Job>>;
  expireJobs():Promise<void>;
  findByRecruiter(recruiterId: string): Promise<Job[]>;
  incrementViews(jobId: string): Promise<void>;
  incrementApplications(jobId: string): Promise<void>;
}
