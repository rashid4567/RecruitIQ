import { ApplicationStatus, type InterviewInfo } from "./jobApplication.types";

export interface CandidateApplication {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt?: Date;
  rejectionReason?: string;
  coverLetter?: string;
  interview?: InterviewInfo;
}
