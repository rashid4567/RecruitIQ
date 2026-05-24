import { Job } from "../../../domain/entities/job.entity";

import { JobRepository } from "../../../domain/repositories/job.repository";

import {
  PaginationOptions,
  JobFilters,
  PaginatedResult,
} from "../../../domain/types/job-filter.type";

export class GetJobsUseCase {
  constructor(private readonly repo: JobRepository) {}

  async execute(
    filters: JobFilters,
    page: number = 1,
    limit = 10,
  ): Promise<PaginatedResult<Job>> {
    const pagination: PaginationOptions = {
      page,
      limit,
    };

    return this.repo.findAll(filters, pagination, {
      field: "createdAt",
      order: "desc",
    });
  }
}
