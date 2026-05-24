import type { JobPostRepository } from "@/module/jobs/domain/repositories/jobPost.Repository";

export class HideJobPostUseCase {
        private readonly repo: JobPostRepository
  constructor(repo : JobPostRepository) {
    this.repo = repo
  }

  async execute(id: string) {
    if (!id) throw new Error("Job ID is required");
    return this.repo.hideJobPost(id);
  }
}