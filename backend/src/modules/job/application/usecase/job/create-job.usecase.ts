import { ApplicationError } from "../../../../../shared/errors/application.error";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { RecruiterSubscriptionRepository } from "../../../../recruiter/domain/repositories/recruiter-subscription.repository";
import { ERROR_CODES } from "../../../../recruiter/application/constants/error.code.constants";
import { CreateJobDTO } from "../../dto/create-job.dto";

export class CreateJobUseCase {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(recruiterId: string, dto: CreateJobDTO): Promise<Job> {
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

    const job = Job.create({
      recruiterId,
      title: dto.title,
      description: dto.description,
      responsibilities: dto.responsibilities ?? [],
      requirements: dto.requirements ?? [],
      requiredSkills: dto.requiredSkills ?? [],
      preferredSkills: dto.preferredSkills ?? [],
      experienceMin: dto.experienceMin,
      experienceMax: dto.experienceMax,
      location: dto.location ?? {
        city: "",
        state: "",
        country: "",
      },
      isRemote: dto.isRemote ?? false,
      jobType: dto.jobType,
      salary: dto.salary ?? {
        min: 0,
        max: 0,
        currency: "INR",
      },
      department: dto.department ?? "General",
      positions: dto.positions ?? 1,
      expiresAt: dto.expiresAt,
      externalLink: dto.externalLink,
    });
    const createdJob = await this.jobRepo.create(job);
    await this.subscriptionRepo.updateUsage({
      subscriptionId: subscription.id,
      jobPostsDelta: 1,
    });
    return createdJob;
  }
}
