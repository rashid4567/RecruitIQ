import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterSubscriptionRepository } from "../../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { Job } from "../../../domain/entities/job.entity";
import { JobRepository } from "../../../domain/repositories/job.repository";

export class PublishJobUseCase {
  constructor(
    private readonly jobRepo: JobRepository,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(
    jobId: string,
    recruiterId: string,
  ): Promise<Job> {
    if (!jobId) {
      throw new ApplicationError(
        ERROR_CODES.JOB_POST_NOT_FOUND,
      );
    }

    if (!recruiterId) {
      throw new ApplicationError(
        ERROR_CODES.UNAUTHORIZED_ACTION,
      );
    }

    const job = await this.jobRepo.findById(jobId);

    if (!job) {
      throw new ApplicationError(
        ERROR_CODES.JOB_POST_NOT_FOUND,
      );
    }

    if (!job.belongsToRecruiter(recruiterId)) {
      throw new ApplicationError(
        ERROR_CODES.UNAUTHORIZED_ACTION,
      );
    }

    if (job.isDeleted()) {
      throw new ApplicationError(
        ERROR_CODES.JOB_POST_NOT_FOUND,
      );
    }

    const subscription =
      await this.subscriptionRepo.findActiveByRecruiter(
        recruiterId,
      );

    if (!subscription) {
      throw new ApplicationError(
        ERROR_CODES.SUBSCRIPTION_REQUIRED,
      );
    }

    if (subscription.isExpired()) {
      throw new ApplicationError(
        ERROR_CODES.SUBSCRIPTION_EXPIRED,
      );
    }

    console.log(
      "Subscription:",
      subscription.toObject(),
    );

    if (
      !subscription.jobPostActiveDays ||
      subscription.jobPostActiveDays < 1
    ) {
      throw new Error(
        `Invalid jobPostActiveDays: ${subscription.jobPostActiveDays}`,
      );
    }

    const expiresAt = job.toObject().expiresAt;

    if (!expiresAt) {
      throw new ApplicationError(
        ERROR_CODES.JOB_EXPIRY_DATE_REQUIRED,
      );
    }

    const maxAllowedDate = new Date();

    maxAllowedDate.setDate(
      maxAllowedDate.getDate() +
        subscription.jobPostActiveDays,
    );

    // Normalize both dates to end of day
    maxAllowedDate.setHours(23, 59, 59, 999);

    const expiryDate = new Date(expiresAt);

    expiryDate.setHours(23, 59, 59, 999);

    // DEBUG LOGS
    console.log(
      "================================",
    );
    console.log("Job expiry:", expiryDate);
    console.log(
      "Max allowed:",
      maxAllowedDate,
    );
    console.log(
      "Plan limit:",
      subscription.jobPostActiveDays,
    );

    const diffDays = Math.ceil(
      (expiryDate.getTime() -
        new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    console.log(
      "Selected Days:",
      diffDays,
    );
    console.log(
      "Comparison:",
      expiryDate.getTime(),
      ">",
      maxAllowedDate.getTime(),
    );
    console.log(
      "================================",
    );

    if (expiryDate > maxAllowedDate) {
      throw new ApplicationError(
        ERROR_CODES.JOB_EXPIRY_EXCEED_PLAN_LIMIT,
      );
    }

    const shouldConsumeCredit =
      job.status === "draft" ||
      job.status === "expired";

    if (shouldConsumeCredit) {
      const updatedSubscription =
        subscription.consumeJobPost();

      await this.subscriptionRepo.update(
        updatedSubscription,
      );
    }

    job.publish();

    return await this.jobRepo.save(job);
  }
}