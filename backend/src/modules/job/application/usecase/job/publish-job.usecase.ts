import crypto from "crypto";

import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";

import { ActivityTrackerService } from "../../../../Activity.logger/application/services/activityTracker.service";
import { ActivityAction } from "../../../../Activity.logger/domain/constants/activityActions";

import { UserRepository } from "../../../../auth/domain/repositories/user.repository";

import { RecruiterSubscriptionRepository } from "../../../../subscription/domain/repository/recruiter-subscription-plan-repository";

import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";

export class PublishJobUseCase {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly activityTracker: ActivityTrackerService,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(jobId: string, recruiterId: string): Promise<Job> {
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

    const subscription =
      await this.subscriptionRepo.findActiveByRecruiter(recruiterId);

    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_REQUIRED);
    }

    if (subscription.isExpired()) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_EXPIRED);
    }

    if (!subscription.jobPostActiveDays || subscription.jobPostActiveDays < 1) {
      throw new Error(
        `Invalid jobPostActiveDays: ${subscription.jobPostActiveDays}`,
      );
    }

    const expiresAt = job.toObject().expiresAt;

    if (!expiresAt) {
      throw new ApplicationError(ERROR_CODES.JOB_EXPIRY_DATE_REQUIRED);
    }

    const maxAllowedDate = new Date();

    maxAllowedDate.setDate(
      maxAllowedDate.getDate() + subscription.jobPostActiveDays,
    );

    maxAllowedDate.setHours(23, 59, 59, 999);

    const expiryDate = new Date(expiresAt);

    expiryDate.setHours(23, 59, 59, 999);

    if (expiryDate > maxAllowedDate) {
      throw new ApplicationError(ERROR_CODES.JOB_EXPIRY_EXCEED_PLAN_LIMIT);
    }

    const shouldConsumeCredit =
      job.status === "draft" || job.status === "expired";

    if (shouldConsumeCredit) {
      const updatedSubscription = subscription.consumeJobPost();

      await this.subscriptionRepo.update(updatedSubscription);
    }

    job.publish();

    const savedJob = await this.jobRepo.save(job);

    try {
      const user = await this.userRepo.findById(recruiterId);

      console.log("RecruiterId:", recruiterId);
      console.log("User:", user);

      await this.activityTracker.track({
        id: crypto.randomUUID(),
        userId: recruiterId,
        action: ActivityAction.JOB_PUBLISHED,
        entityType: "JOB",
        entityId: savedJob.id!,
        metadata: {
          recruiterName: user?.fullName ?? "Unknown Recruiter",
          title: savedJob.title,
          status: savedJob.status,
          publicationCount: savedJob.publicationCount,
        },
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }

    return savedJob;
  }
}
