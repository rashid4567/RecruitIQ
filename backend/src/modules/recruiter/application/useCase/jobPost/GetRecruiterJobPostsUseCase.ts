import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";

export class GetRecruiterJobPostsUseCase {
  constructor(private readonly jobPostRepo: JobPostRepository) {}

  async execute(recruiterId: string): Promise<JobPost[]> {
    if(!recruiterId){
      throw new Error("Unauthorized")
    }

    const jobs =  this.jobPostRepo.findAllByRecruiter(recruiterId);
    return jobs;
  }
}