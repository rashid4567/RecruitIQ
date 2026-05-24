import type { JobPostRepository } from "./../../../domain/repositories/jobPost.Repository";

export class GetJobPostByIdUseCase {
  private readonly repo: JobPostRepository;
  constructor(repo: JobPostRepository) {
    this.repo = repo;
  }

  async execute(id: string) {
    if (!id?.trim()) {
      throw new Error("Job id required");
    }

    return this.repo.getJobPostById(id);
  }
}
