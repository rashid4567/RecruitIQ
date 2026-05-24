import type { UpdateJobPostDTO } from "@/module/jobs/domain/dto/updateJobPost.dto";
import type { JobPostRepository } from "@/module/jobs/domain/repositories/jobPost.Repository";

export class UpdateJobPostUseCase {
  private readonly repo: JobPostRepository;
  constructor(repo: JobPostRepository) {
    this.repo = repo;
  }

  async execute(recruiterId: string, id: string, dto: UpdateJobPostDTO) {
    if (!id) throw new Error("Job ID is required");

    const job = await this.repo.getJobPostById(id);

    if (job.recruiterId !== recruiterId) {
      throw new Error("Unauthorized");
    }

    if (
      dto.experienceMin !== undefined &&
      dto.experienceMax !== undefined &&
      dto.experienceMin > dto.experienceMax
    ) {
      throw new Error("Invalid experience range");
    }

    const updatedJob = job.update(dto);
    return this.repo.updateJobPost(id, updatedJob);
  }
}
