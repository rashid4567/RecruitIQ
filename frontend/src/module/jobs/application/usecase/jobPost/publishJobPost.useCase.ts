import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import type { JobPostRepository } from "@/module/jobs/domain/repositories/jobPost.Repository";

export class PublishJobPostUseCase {
  private readonly jobPostRepo: JobPostRepository;
  constructor(jobPostRepo: JobPostRepository) {
    this.jobPostRepo = jobPostRepo;
  }

  async execute(id: string): Promise<Job> {
    if (!id) {
      throw new Error("Job post ID is required");
    }

    const job = await this.jobPostRepo.getJobPostById(id);
    if (!job) {
      throw new Error("Jobpost not found");
    }
    if (!job.isDraft()) {
      throw new Error("Only draft jobs can be published");
    }

    return await this.jobPostRepo.publish(id);
  
  }
}
