import type { JobPostRepository }
from "../../../domain/repositories/jobPost.Repository";

import type { Job }
from "../../../domain/entity/jobPost.entity";

export class UnBlockJobPostUseCase {

  private readonly repo:
  JobPostRepository;

  constructor(
    repo: JobPostRepository
  ) {
    this.repo = repo;
  }

  async execute(
    jobId: string
  ): Promise<Job> {

    if (!jobId) {
      throw new Error(
        "Job id required"
      );
    }

    return await this.repo
      .unblockJobPost(
        jobId
      );
  }
}