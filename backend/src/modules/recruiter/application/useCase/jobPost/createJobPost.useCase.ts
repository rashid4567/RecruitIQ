import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";
import { CreateJobPostDTO } from "../../dto/jobPost.dto";

export class CreateJobPostUseCase {
  constructor(
    private readonly jobPostRepo: JobPostRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(recruiterId: string, dto: CreateJobPostDTO): Promise<JobPost> {
    if (!recruiterId) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }

    const subscription =
      await this.subscriptionRepo.findActiveByRecruiterId(recruiterId);

    if (!subscription) {
      throw new ApplicationError(
        ERROR_CODES.NO_ACTIVE_SUBSCRIPTION_FOUND_FOR_THIS_RECRUITER,
      );
    }

    if (!subscription.canPostJob()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_LIMIT_EXCEEDED);
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

    const created = await this.jobPostRepo.create(jobPost);
    await this.subscriptionRepo.updateUsage({
      subscriptionId: subscription.id,
      jobPostsDelta: 1,
    });

    return created;
  }
}
