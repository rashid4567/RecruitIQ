import type { UpdateJobPostDTO } from "@/module/recruiter/Domain/dto/updateJobPost.dto";
import type { JobPostRepository } from "@/module/recruiter/Domain/repositories/jobPost.Repository";

export class UpdateJobPostUseCase {
  private readonly repo: JobPostRepository;
  constructor(repo: JobPostRepository) {
    this.repo = repo;
  }

  async execute(id: string, dto: UpdateJobPostDTO) {
    if (!id) throw new Error("Job ID is required");

    // optional validation
    if (
      dto.experienceMin !== undefined &&
      dto.experienceMax !== undefined &&
      dto.experienceMin > dto.experienceMax
    ) {
      throw new Error("Invalid experience range");
    }

    return this.repo.updateJobPost(id, dto);
  }
}
