import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";

export class ToggleJobPostVisibilityUseCase {
  constructor(private readonly jobPostRepo: JobPostRepository) {}

  async execute(
    id: string,
    recruiterId: string,
    shouldHide: boolean,
  ): Promise<JobPost> {
    const existing = await this.jobPostRepo.findById(id);

    if (!existing || existing.getRecruiterId() !== recruiterId) {
      throw new Error("Job post not found or unauthorized");
    }

    if (shouldHide) {
      existing.hide();
    } else {
      existing.unhide();
    }

    return this.jobPostRepo.save(existing);
  }
}