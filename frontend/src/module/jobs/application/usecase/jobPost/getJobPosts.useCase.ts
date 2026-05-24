import type { JobPostFilters } from "../../../domain/dto/JobPostDTO";

import type { JobPostRepository } from "../../../domain/repositories/jobPost.Repository";

export class GetJobPostsUseCase {
  private readonly repo: JobPostRepository
  constructor( repo: JobPostRepository) {
    this.repo = repo
  }

  async execute(filters?: JobPostFilters) {
    return this.repo.getJobPosts(filters);
  }
}
