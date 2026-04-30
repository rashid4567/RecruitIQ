import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";
import { ERROR_CODES } from "../../constants/error.code.constants";
import { CreateJobPostDTO } from "../../dto/jobPost.dto";

export class CreateJobPostUseCase {
  constructor(private readonly jobPostRepo: JobPostRepository) {}

  async execute(recruiterId: string, dto: CreateJobPostDTO): Promise<JobPost> {

    if (!recruiterId) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }

    if (!dto.title || dto.title.trim().length < 3) {
      throw new ApplicationError(ERROR_CODES.INVALID_JOB_TITLE);
    }

    if (!dto.description || dto.description.trim().length < 10) {
      throw new ApplicationError(ERROR_CODES.INVALID_JOB_DESCRIPTION);
    }

 
    if (dto.experienceMin > dto.experienceMax) {
      throw new ApplicationError(ERROR_CODES.INVALID_EXPERIENCE_RANGE);
    }

   
    const jobPost = JobPost.create({
      recruiterId,
      title: dto.title.trim(),
      description: dto.description.trim(),
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