import {
  ApplicationStatus,
  type InterviewInfo,
} from "./jobApplication.types";

export interface CandidateApplication {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;

  status: ApplicationStatus;

  appliedAt: Date;

  rejectionReason?: string;

  interview?: InterviewInfo;
}