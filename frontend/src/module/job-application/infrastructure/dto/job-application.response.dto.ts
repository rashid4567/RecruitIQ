import type {
  ApplicationStatus,
  InterviewInfo,
} from "../../domain/entity/job-application.entity";

export interface JobApplicationResponseDTO {
  id: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  interview?: InterviewInfo;
  rejectionReason?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface RecruiterApplicationResponseDTO {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  resumeId: string;
  status: ApplicationStatus;
  appliedAt: string;
}