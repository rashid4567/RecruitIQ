import { ApplicationError } from "../../../../../shared/errors/application.error";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { RecruiterSubscriptionRepository } from "../../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { ERROR_CODES } from "../../../../recruiter/application/constants/error.code.constants";
import { CreateJobDTO } from "../../dto/create-job.dto";
import { RecruiterProfileRepository } from "../../../../recruiter/domain/repositories/recruiter.repository";
import { UserId } from "../../../../../shared/value-objects/userId.vo";


export class CreateJobUseCase {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly recruiterRepo: RecruiterProfileRepository,
  ) {}

  async execute(recruiterId: string, dto: CreateJobDTO): Promise<Job> {
    if (!recruiterId) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }

    const profile = await this.recruiterRepo.findByUserId(
      UserId.create(recruiterId),
    );

    if (!profile) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }

   

    const subscription =
      await this.subscriptionRepo.findActiveByRecruiter(recruiterId);

    if (!subscription) {
      throw new ApplicationError(
        ERROR_CODES.NO_ACTIVE_SUBSCRIPTION_FOUND_FOR_THIS_RECRUITER,
      );
    }

    if (subscription.isExpired()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_LIMIT_EXCEEDED);
    }

    if (dto.expiresAt) {
      this.validateExpiryDate(dto.expiresAt, subscription.jobPostActiveDays);
    }

    const job = Job.create({
      recruiterId,
      companyName : dto.companyName,
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
      externalLink: dto.externalLink,
      expiresAt: dto.expiresAt,
    });

    return await this.jobRepo.create(job);
  }

  private validateExpiryDate(expiresAt: Date, activeDays: number): void {
    const maxAllowedDate = new Date();

    maxAllowedDate.setDate(maxAllowedDate.getDate() + activeDays);

    maxAllowedDate.setHours(23, 59, 59, 999);

    const expiryDate = new Date(expiresAt);

    expiryDate.setHours(23, 59, 59, 999);

    if (expiryDate > maxAllowedDate) {
      throw new ApplicationError(ERROR_CODES.JOB_EXPIRY_EXCEED_PLAN_LIMIT);
    }
  }
}
