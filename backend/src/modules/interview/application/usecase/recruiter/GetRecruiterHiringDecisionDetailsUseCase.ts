import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { User } from "../../../../auth/domain/entities/user.entity";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { Interview } from "../../../../interview/domain/entity/interview.entity";
import { InterviewRepository } from "../../../../interview/domain/repository/interview.repository";
import { Job } from "../../../../job/domain/entities/job.entity";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { Resume } from "../../../../resume/domain/entity/resume.entity";
import { FileStorageRepository } from "../../../../resume/domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { JobApplication } from "../../../../job-application/domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import {
  GetRecruiterHiringDecisionDetailsRequestDTO,
  RecruiterHiringDecisionDetailsResponseDTO,
} from "../../../../interview/application/dto/GetRecruiterHiringDecisionDetails.dto";

export class GetRecruiterHiringDecisionDetailsUseCase implements IUseCase<
  GetRecruiterHiringDecisionDetailsRequestDTO,
  RecruiterHiringDecisionDetailsResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly applicationRepo: JobApplicationRepository,
    private readonly userRepo: UserRepository,
    private readonly jobRepo: JobRepository,
    private readonly resumeRepo: ResumeRepository,
    private readonly storageRepo: FileStorageRepository,
  ) {}

  async execute(
    input: GetRecruiterHiringDecisionDetailsRequestDTO,
  ): Promise<RecruiterHiringDecisionDetailsResponseDTO> {
    const interview = await this.validateInterview(input);
    const application = await this.validateApplication(
      interview.applicationId,
      input.recruiterId,
    );
    const [candidate, job, resume] = await Promise.all([
      this.getCandidate(application.candidateId),
      this.getJob(application.jobId),
      this.getResume(application.resumeId),
    ]);
    const previewUrl = await this.storageRepo.getViewUrl(resume.getFileKey());

    return {
      application: {
        applicationId: application.id,
        applicationNumber: application.applicationNumber,
        jobId: application.jobId,
        recruiterId: application.recruiterId,
        candidateId: application.candidateId,
        resumeId: application.resumeId,
        candidateName: candidate.fullName,
        candidateEmail: candidate.email.getValue(),
        candidateProfileImage: candidate.profileImage,
        status: application.status,
        analysisStatus: application.analysisStatus,
        coverLetter: application.coverLetter,
        rejectionReason: application.rejectionReason,
        aiAnalysis: application.aiAnalysis,
        appliedAt: application.appliedAt,
        updatedAt: application.updatedAt,
      },

      interview: {
        interviewId: interview.id,
        title: interview.title,
        description: interview.description,
        round: interview.round,
        mode: interview.mode,
        status: interview.status,
        candidateResponseStatus: interview.candidateResponseStatus,
        scheduledAt: interview.scheduledAt,
        durationInMinutes: interview.durationInMinutes,
        location: interview.location,
        startedAt: interview.startedAt,
        endedAt: interview.endedAt,
        recruiterJoinedAt: interview.recruiterJoinedAt,
        candidateJoinedAt: interview.candidateJoinedAt,
        notes: interview.notes,
        completed: interview.isCompleted(),
      },

      job: {
        jobId: job.id!,
        title: job.title,
      },

      resume: {
        resumeId: resume.getId()!,
        fileName: resume.getFileName(),
        previewUrl,
        uploadedAt: resume.getUploadedAt(),
        parseStatus: resume.getParseStatus(),
        parsedData: resume.getParsedData(),
      },
    };
  }

  private async validateInterview(
  input: GetRecruiterHiringDecisionDetailsRequestDTO,
): Promise<Interview> {
  const interview = await this.interviewRepo.findById(input.interviewId);

  if (!interview) {
    throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
  }

  if (!interview.belongsToRecruiter(input.recruiterId)) {
    throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
  }

  if (!interview.isCompleted()) {
    throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_COMPLETED);
  }

  return interview;
}

  private async validateApplication(
    applicationId: string,
    recruiterId: string,
  ): Promise<JobApplication> {
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    if (!application.belongsToRecruiter(recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }
    return application;
  }

  private async getCandidate(candidateId: string): Promise<User> {
    const candidate = await this.userRepo.findById(candidateId);
    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }
    return candidate;
  }

  private async getJob(jobId: string): Promise<Job> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_NOT_FOUND);
    }

    if (job.isBlocked) {
  throw new ApplicationError(
    ERROR_CODES.JOB_POST_IS_BLOCKED_BY_ADMIN,
  );
}
    return job;
  }

  private async getResume(resumeId: string): Promise<Resume> {
    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }
    return resume;
  }
}
