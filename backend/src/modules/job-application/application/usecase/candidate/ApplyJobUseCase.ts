import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { User } from "../../../../auth/domain/entities/user.entity";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { SendEmailByEventUseCase } from "../../../../email/application/usecase/email-template/send-email-by-event.usecase";
import { EmailEvent } from "../../../../email/domain/constant/templateEvents";
import { Job } from "../../../../job/domain/entities/job.entity";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import {
  Resume,
  ResumeParseStatus,
} from "../../../../resume/domain/entity/resume.entity";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { JobApplication } from "../../../domain/entity/job-application.entity";
import { APPLICATION_ERRORS } from "../../../domain/error/Application.error";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { ApplyJobDTO } from "../../dto/applyJobDto";
import { AnalyzeApplicationUseCase } from "./AnalyzeApplicationUseCase";

export class ApplyJobUseCase implements UseCase<ApplyJobDTO, JobApplication> {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly resumeRepo: ResumeRepository,
    private readonly userRepo: UserRepository,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
    private readonly createNotificationUC: CreateNotificationUseCase,
    private readonly analyzeApplicationUC: AnalyzeApplicationUseCase,
  ) {}

  async execute(dto: ApplyJobDTO): Promise<JobApplication> {
    const { jobId, candidateId, resumeId, coverLetter } = dto;
    const job = await this.validateAndGetJob(jobId);
    await this.validateAndGetResume(resumeId, candidateId);
    await this.ensureApplicationDoesNotExist(candidateId, jobId);
    const candidate = await this.userRepo.findById(candidateId);

    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }

    const application = JobApplication.apply({
      jobId,
      candidateId,
      recruiterId: job.recruiterId,
      resumeId,
      coverLetter,
    });

    const created = await this.applicationRepo.create(application);
    job.incrementApplications();
    await this.jobRepo.save(job);
    this.triggerPostApplicationActions(created, candidate, job);
    return created;
  }

  private async validateAndGetJob(jobId: string): Promise<Job> {
    const job = await this.jobRepo.findById(jobId);

    if (!job) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_NOT_FOUND);
    }

    if (!job.canApply()) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_NOT_ACTIVE);
    }
    if (job.isExpired()) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_EXPIRED);
    }
    return job;
  }

  private async validateAndGetResume(
    resumeId: string,
    candidateId: string,
  ): Promise<Resume> {
    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) {
      throw new ApplicationError(APPLICATION_ERRORS.RESUME_NOT_FOUND);
    }
    if (resume.getCandidateId() !== candidateId) {
      throw new ApplicationError(
        APPLICATION_ERRORS.UNAUTHORIZED_CANDIDATE_ACTION,
      );
    }
    if (resume.getParseStatus() === ResumeParseStatus.FAILED) {
      throw new ApplicationError(ERROR_CODES.RESUME_PARSE_FAILED);
    }
    return resume;
  }

  private async ensureApplicationDoesNotExist(
    candidateId: string,
    jobId: string,
  ): Promise<void> {
    const existing = await this.applicationRepo.findExistingApplication(
      candidateId,
      jobId,
    );

    if (existing) {
      throw new ApplicationError(APPLICATION_ERRORS.APPLICATION_ALREADY_EXISTS);
    }
  }

  private triggerPostApplicationActions(
    application: JobApplication,
    candidate: User | null,
    job: Job,
  ): void {
    this.triggerAnalysis(application);

    this.notifyRecruiter(application, candidate, job);

    if (candidate) {
      this.sendCandidateConfirmationEmail(candidate, job);
    }
  }

  private triggerAnalysis(application: JobApplication): void {
    void this.analyzeApplicationUC
      .execute({ applicationId: application.id! })
      .catch((err) => console.error("Application analysis failed:", err));
  }

  private notifyRecruiter(
    application: JobApplication,
    candidate: User | null,
    job: Job,
  ): void {
    void this.createNotificationUC
      .execute({
        recipientId: job.recruiterId,
        recipientRole: "recruiter",
        title: "New Job Application",
        message: `${candidate?.fullName ?? "A candidate"} applied for ${job.title}`,
        type: NotificationType.JOB_APPLIED,
        actionUrl: `/recruiter/applications/${application.id}`,
        referenceId: application.id,
        metadata: {
          applicationId: application.id,
          candidateId: application.candidateId,
          jobId: application.jobId,
          jobTitle: job.title,
        },
      })
      .catch((err) => console.error("JOB_APPLIED notification failed:", err));
  }
  private sendCandidateConfirmationEmail(candidate: User, job: Job): void {
    void this.sendEmailByEventUC
      .execute({
        to: candidate.email.getValue(),
        event: EmailEvent.JOB_APPLIED,
        variables: {
          candidateName: candidate.fullName,
          jobTitle: job.title,
          companyName: job.companyName,
          applicationDate: new Date().toLocaleDateString(),
        },
      })
      .catch((err) => console.error("JOB_APPLIED email failed:", err));
  }
}
