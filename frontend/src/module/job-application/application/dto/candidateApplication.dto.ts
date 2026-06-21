import { ApplicationStatus } from "../../domain/entity/job-application.entity"; 

export interface CandidateApplication {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: string;
}