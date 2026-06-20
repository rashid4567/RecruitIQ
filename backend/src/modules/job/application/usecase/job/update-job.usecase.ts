import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { RecruiterSubscriptionRepository } from "../../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { UpdateJobPostRequestDTO } from "../../dto/update-job.dto";

export class UpdateJobUseCase implements UseCase<UpdateJobPostRequestDTO, Job> {
  constructor(
    private readonly repo: JobRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(request: UpdateJobPostRequestDTO): Promise<Job> {
    if (!request.jobId) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!request.recruiterId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    const job = await this.repo.findById(request.jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!job.belongsToRecruiter(request.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    if (job.isDeleted()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (job.status === "active") {
      throw new ApplicationError(
        ERROR_CODES.JOB_ALREADY_PUBLISHED_CANNOT_BE_UPDATED,
      );
    }

    const dto = request.dto;

    if (dto.expiresAt) {
      const subscription = await this.subscriptionRepo.findActiveByRecruiter(
        request.recruiterId,
      );
      if (!subscription) {
        throw new ApplicationError(
          ERROR_CODES.NO_ACTIVE_SUBSCRIPTION_FOUND_FOR_THIS_RECRUITER,
        );
      }

      if (subscription.isExpired()) {
        throw new ApplicationError(ERROR_CODES.JOB_POST_LIMIT_EXCEEDED);
      }
      this.validateExpiryDate(dto.expiresAt, subscription.jobPostActiveDays);
    }

    job.update(dto);
    return await this.repo.save(job);
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
