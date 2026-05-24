import type { JobPost } from "../../domain/entities/jobPost";
import type { jobPostRepository } from "../../domain/repositories/jobPost.Repository";

export class GetJobPostByIdUseCase {
  private readonly jobPostRepo: jobPostRepository;
  constructor(jobPostRepo: jobPostRepository) {
    this.jobPostRepo = jobPostRepo;
  }

  async execute(id: string): Promise<JobPost> {
    const job = await this.jobPostRepo.getById(id);
    return job;
  }
}
