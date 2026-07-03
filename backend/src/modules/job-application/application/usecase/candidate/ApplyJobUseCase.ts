import { DAILY_JOB_APPLICATION_LIMIT } from "../../../../../shared/constants/application.constants";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { User } from "../../../../auth/domain/entities/user.entity";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { sendEmailByInputDto } from "../../../../email/application/dto/email.template/sentEmail.input.dto";
import { EmailEvent } from "../../../../email/domain/constant/templateEvents";
import { Job } from "../../../../job/domain/entities/job.entity";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationRequest } from "../../../../notification/application/dto/createNotification.dto";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { Notification } from "../../../../notification/domain/entities/Notification";
import { ApplicationNumberGenerator } from "../../../domain/service/application-number-generator";
import {
  Resume,
  ResumeParseStatus,
} from "../../../../resume/domain/entity/resume.entity";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { JobApplication } from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { AnalyzeApplicationRequestDTO } from "../../dto/analyseJobpost.dto";
import { ApplyJobDTO } from "../../dto/applyJobDto";

export class ApplyJobUseCase implements IUseCase<ApplyJobDTO, JobApplication> {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly applicationNumberGenerator: ApplicationNumberGenerator,
    private readonly jobRepo: JobRepository,
    private readonly resumeRepo: ResumeRepository,
    private readonly userRepo: UserRepository,
    private readonly sendEmailByEventUC: IUseCase<sendEmailByInputDto, void>,
    private readonly createNotificationUC: IUseCase<
      CreateNotificationRequest,
      Notification
    >,
    private readonly analyzeApplicationUC: IUseCase<
      AnalyzeApplicationRequestDTO,
      void
    >,
  ) {}

  async execute(dto: ApplyJobDTO): Promise<JobApplication> {
    const { jobId, candidateId, resumeId, coverLetter } = dto;

    const job = await this.validateAndGetJob(jobId);
    await this.validateAndGetResume(resumeId, candidateId);
    await this.validateDailyApplicationLimit(candidateId);
    await this.ensureApplicationDoesNotExist(candidateId, jobId);
    const candidate = await this.userRepo.findById(candidateId);

    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }

    const applicationNumber = await this.applicationNumberGenerator.generate();
    const application = JobApplication.apply({
      applicationNumber,
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
      throw new ApplicationError(ERROR_CODES.JOB_NOT_FOUND);
    }

    if (!job.canApply()) {
      throw new ApplicationError(ERROR_CODES.JOB_NOT_ACTIVE);
    }
    if (job.isExpired()) {
      throw new ApplicationError(ERROR_CODES.JOB_EXPIRED);
    }
    return job;
  }

  private async validateAndGetResume(
    resumeId: string,
    candidateId: string,
  ): Promise<Resume> {
    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }
    if (resume.getCandidateId() !== candidateId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_CANDIDATE_ACTION);
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
      throw new ApplicationError(ERROR_CODES.APPLICATION_ALREADY_EXISTS);
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

  private async validateDailyApplicationLimit(
    candidateId: string,
  ): Promise<void> {
    const todaysApplicationCount =
      await this.applicationRepo.countTodayApplicationsByCandidate(candidateId);

    if (todaysApplicationCount >= DAILY_JOB_APPLICATION_LIMIT) {
      throw new ApplicationError(
        ERROR_CODES.DAILY_JOB_APPLICATION_LIMIT_REACHED,
      );
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
