import { ApplicationStatus } from "../../domain/entity/job-application.entity";

export interface CandidateApplicationListItemDTO {
  applicationId: string;
    applicationNumber: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: Date;
}


export interface GetMyApplicationRequestDTO {
  candidateId: string;
}