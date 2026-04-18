import type { CreateJobPostDTO } from "@/module/recruiter/Domain/dto/jobPost.dto";
import type { JobPostRepository } from "@/module/recruiter/Domain/repositories/jobPost.Repository";

export class CreateJobPostUseCase {
  private repo: JobPostRepository;
  constructor(repo : JobPostRepository){
    this.repo = repo;
  }
  async execute(dto: CreateJobPostDTO) {
  if (!dto.title || !dto.description) {
    throw new Error("Title and description are required");
  }

  if (dto.experienceMin > dto.experienceMax) {
    throw new Error("Invalid experience range");
  }

  return this.repo.createJobPost(dto);
}
}
