import { ApplicationStatus, type InterviewSummary } from "./jobApplication.types";

export interface CandidateApplication {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  appliedResumeFileName: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt?: Date;
  rejectionReason?: string;
  coverLetter?: string;
  interview?: InterviewSummary;
}
