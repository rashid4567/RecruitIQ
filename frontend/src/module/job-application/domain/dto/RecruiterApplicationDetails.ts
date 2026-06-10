import type { ApplicationStatus, InterviewInfo } from "../entity/job-application.entity";

export interface RecruiterApplicationDetails {
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateProfileImage?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  interview?: InterviewInfo;
  rejectionReason?: string;
  appliedAt: string;
  updatedAt: string;
}