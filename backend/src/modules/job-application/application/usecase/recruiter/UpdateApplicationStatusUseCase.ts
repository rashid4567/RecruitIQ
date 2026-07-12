import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { DomainError } from "../../../../../shared/errors/domain.error";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { SendEmailByEventUseCase } from "../../../../email/application/usecase/email-template/send-email-by-event.usecase";
import { EmailEvent } from "../../../../email/domain/constant/templateEvents";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { Job } from "../../../../job/domain/entities/job.entity";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import {
  ApplicationStatus,
  JobApplication,
} from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { UpdateApplicationStatusDTO } from "../../dto/UpdateApplicationStatusDTO";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

export class UpdateApplicationStatusUseCase implements IUseCase<
  UpdateApplicationStatusDTO,
  void
> {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
    private readonly createNotificationUC: CreateNotificationUseCase,
  ) {}

  async execute(dto: UpdateApplicationStatusDTO): Promise<void> {
    try {
      const application = await this.validateAndGetApplication(dto);
      const job = await this.validateAndGetJob(application.jobId);
      if (job.isBlocked) {
        throw new ApplicationError(ERROR_CODES.JOB_POST_IS_BLOCKED_BY_ADMIN);
      }

      this.updateApplicationStatus(
        application,
        dto.status,
        dto.rejectionReason,
      );
      await this.applicationRepo.save(application);
      await this.notifyCandidate(application, job, dto);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ApplicationError(error.message);
      }
      throw error;
    }
  }

  private async validateAndGetApplication(
    dto: UpdateApplicationStatusDTO,
  ): Promise<JobApplication> {
    const application = await this.applicationRepo.findById(dto.applicationId);
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    if (!application.belongsToRecruiter(dto.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }
    return application;
  }

  private async validateAndGetJob(jobId: string): Promise<Job> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_NOT_FOUND);
    }
    if (job.isBlocked) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_IS_BLOCKED_BY_ADMIN);
    }
    return job;
  }

  private updateApplicationStatus(
    application: JobApplication,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): void {
    const allowedStatuses: ApplicationStatus[] = [
      ApplicationStatus.SHORTLISTED,
      ApplicationStatus.REJECTED,
    ];
    if (!allowedStatuses.includes(status)) {
      throw new ApplicationError(ERROR_CODES.INVALID_APPLICATION_STATUS);
    }

    switch (status) {
      case ApplicationStatus.SHORTLISTED:
        if (!application.canRecruiterShortlist()) {
          throw new ApplicationError(
            ERROR_CODES.APPLICATION_CANNOT_BE_SHORTLISTED,
          );
        }

        application.shortlist();
        break;

      case ApplicationStatus.REJECTED:
        if (!application.canReject()) {
          throw new ApplicationError(
            ERROR_CODES.APPLICATION_CANNOT_BE_REJECTED,
          );
        }

        application.reject(rejectionReason);
        break;
    }
  }

  private async notifyCandidate(
    application: JobApplication,
    job: Job,
    dto: UpdateApplicationStatusDTO,
  ): Promise<void> {
    const candidate = await this.userRepo.findById(application.candidateId);

    if (!candidate) {
      return;
    }

    try {
      switch (dto.status) {
        case ApplicationStatus.SHORTLISTED:
          await this.createNotificationUC.execute({
            recipientId: application.candidateId,
            recipientRole: "candidate",
            title: "Application Shortlisted",
            message: `Your application for ${job.title} at ${job.companyName} has been shortlisted.`,
            type: NotificationType.APPLICATION_SHORTLISTED,
            actionUrl: "/candidate/applications",
            referenceId: dto.applicationId,
            metadata: {
              applicationId: dto.applicationId,
              jobId: application.jobId,
            },
          });
          break;

        case ApplicationStatus.REJECTED:
          await this.sendEmailByEventUC.execute({
            to: candidate.email.getValue(),
            event: EmailEvent.REJECTED,
            variables: {
              candidateName: candidate.fullName,
              jobTitle: job.title,
              companyName: job.companyName,
            },
          });

          await this.createNotificationUC.execute({
            recipientId: application.candidateId,
            recipientRole: "candidate",
            title: "Application Rejected",
            message: `Your application for ${job.title} at ${job.companyName} was not selected.`,
            type: NotificationType.APPLICATION_REJECTED,
            actionUrl: "/candidate/applications",
            referenceId: dto.applicationId,
            metadata: {
              applicationId: dto.applicationId,
              jobId: application.jobId,
              rejectionReason: dto.rejectionReason,
            },
          });
          break;
      }
    } catch (err) {
      console.error(`${dto.status} notification/email failed:`, err);
    }
  }
}
