import { JobPost } from "../../../Domain/entities/jobPost-entity";
import { AdminJobPostFilters, JobPostRepostory, PaginatedResult, PaginationOptions, SortOptions } from "../../../Domain/repositories/jobPost-repository";

export class GetAllJobPostsUseCase {
  constructor(private jobPostRepository: JobPostRepostory) {}

  async execute(
    filters: AdminJobPostFilters,
    pagination: PaginationOptions,
    sort: SortOptions,
    includeDeleted?: boolean
  ): Promise<PaginatedResult<JobPost>> {
    
    // basic validation
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new Error("Invalid pagination values");
    }

    return await this.jobPostRepository.findAll(
      filters,
      pagination,
      sort.field,
      includeDeleted
    );
  }
}