import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import {
  PaginationOptions,
  JobFilters,
  PaginatedResult,
} from "../../../domain/types/job-filter.type";
import { GetJobsRequestDTO } from "../../dto/getJobPostRequest.dto";

export class GetJobsUseCase implements UseCase<
  GetJobsRequestDTO,
  PaginatedResult<Job>
> {
  constructor(private readonly repo: JobRepository) {}

  async execute(input: GetJobsRequestDTO): Promise<PaginatedResult<Job>> {
    const { filters, page = 1, limit = 10 } = input;

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
