import { BaseRepository } from "../../../../shared/repositories/base.repository";
import { Job } from "../entities/job.entity";

import {
  JobFilters,
  PaginationOptions,
  PaginatedResult,
  SortOptions,
} from "../types/job-filter.type";

export interface JobRepository extends BaseRepository<Job> {
  create(job: Job): Promise<Job>;
  save(job: Job): Promise<Job>;
  findAll(
    filters: JobFilters,
    pagination: PaginationOptions,
    sort?: SortOptions,
  ): Promise<PaginatedResult<Job>>;
  expireJobs(): Promise<void>;
  findByRecruiter(recruiterId: string): Promise<Job[]>;
  incrementViews(jobId: string): Promise<void>;
  incrementApplications(jobId: string): Promise<void>;
}
