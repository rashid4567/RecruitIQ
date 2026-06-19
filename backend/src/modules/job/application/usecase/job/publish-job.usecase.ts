import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ActivityTrackerService } from "../../../../Activity.logger/application/services/activityTracker.service";
import { ActivityAction } from "../../../../Activity.logger/domain/constants/activityActions";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { RecruiterSubscription } from "../../../../subscription/domain/entities/recruiter-subscription.entity";
import { RecruiterSubscriptionRepository } from "../../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { PublishJobPostRequestDTO } from "../../dto/publish.job.dto";

import { IdGenerator } from "../../ports/id.generator.prots";

export class PublishJobUseCase implements UseCase<PublishJobPostRequestDTO,Job> {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly activityTracker: ActivityTrackerService,
    private readonly idGenerator: IdGenerator,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(request : PublishJobPostRequestDTO): Promise<Job> {
    const job = await this.validateAndGetJob(request.jobId, request.recruiterId);
    const subscription = await this.validateAndGetSubscription(request.recruiterId);
    this.validateExpiryLimit(job, subscription.jobPostActiveDays);
    await this.consumeCreditsIfNeeded(job, subscription);
    job.publish();
    const savedJob = await this.jobRepo.save(job);
    this.trackPublication(request.recruiterId, savedJob);
    return savedJob;
  }

  private async validateAndGetJob(
    jobId: string,
    recruiterId: string,
  ): Promise<Job> {
    if (!jobId) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!recruiterId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    const job = await this.jobRepo.findById(jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    if (!job.belongsToRecruiter(recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    if (job.isDeleted()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    return job;
  }

  private async validateAndGetSubscription(recruiterId: string) {
    const subscription =
      await this.subscriptionRepo.findActiveByRecruiter(recruiterId);

    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_REQUIRED);
    }

    if (subscription.isExpired()) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_EXPIRED);
    }

    if (!subscription.jobPostActiveDays || subscription.jobPostActiveDays < 1) {
      throw new ApplicationError(
        ERROR_CODES.INVALID_SUBSCRIPTION_CONFIGURATION,
      );
    }

    return subscription;
  }

  private validateExpiryLimit(job: Job, jobPostActiveDays: number): void {
    const expiresAt = job.toObject().expiresAt;

    if (!expiresAt) {
      throw new ApplicationError(ERROR_CODES.JOB_EXPIRY_DATE_REQUIRED);
    }

    const maxAllowedDate = new Date();
    maxAllowedDate.setDate(maxAllowedDate.getDate() + jobPostActiveDays);
    maxAllowedDate.setHours(23, 59, 59, 999);
    const expiryDate = new Date(expiresAt);
    expiryDate.setHours(23, 59, 59, 999);
    if (expiryDate > maxAllowedDate) {
      throw new ApplicationError(ERROR_CODES.JOB_EXPIRY_EXCEED_PLAN_LIMIT);
    }
  }

  private async consumeCreditsIfNeeded(
    job: Job,
    subscription: RecruiterSubscription,
  ): Promise<void> {
    const shouldConsumeCredit =
      job.status === "draft" || job.status === "expired";

    if (!shouldConsumeCredit) {
      return;
    }

    if (!subscription.hasJobPostAccess()) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_LIMIT_REACHED);
    }

    const updatedSubscription = subscription.consumeJobPost();

    await this.subscriptionRepo.update(updatedSubscription);
  }

  private trackPublication(recruiterId: string, job: Job): void {
    void this.logActivity(recruiterId, job).catch((err) =>
      console.error("Activity log failed:", err),
    );
  }

  private async logActivity(recruiterId: string, job: Job): Promise<void> {
    const user = await this.userRepo.findById(recruiterId);

    const trackerId = this.idGenerator.generate();

    await this.activityTracker.track({
      id: trackerId,
      userId: recruiterId,
      action: ActivityAction.JOB_PUBLISHED,
      entityType: "JOB",
      entityId: job.id!,
      metadata: {
        recruiterName: user?.fullName ?? "Unknown Recruiter",
        title: job.title,
        status: job.status,
        publicationCount: job.publicationCount,
      },
      createdAt: new Date(),
    });
  }
}
