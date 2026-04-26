import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";
import { CreateJobPostDTO } from "../../dto/jobPost.dto";

export class CreateJobPostUseCase {
  constructor(private readonly jobPostRepo: JobPostRepository) {}

  async execute(recruiterId: string, dto: CreateJobPostDTO): Promise<JobPost> {
    const jobPost = JobPost.create({
      recruiterId,
      title: dto.title,
      description: dto.description,
      jobType: dto.jobType,
      experienceMin: dto.experienceMin,
      experienceMax: dto.experienceMax,
      responsibilities: dto.responsibilities,
      requirements: dto.requirements,
      requiredSkills: dto.requiredSkills,
      preferredSkills: dto.preferredSkills,
      location: dto.location,
      isRemote: dto.isRemote,
      salary: dto.salary,
      department: dto.department,
      positions: dto.positions,
      expiresAt: dto.expiresAt,
      externalLink: dto.externalLink,
    });

    return this.jobPostRepo.create(jobPost);
  }
}
