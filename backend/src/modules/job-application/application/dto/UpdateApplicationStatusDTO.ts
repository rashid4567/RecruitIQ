import { ApplicationStatus } from "../../domain/entity/job-application.entity";

export interface UpdateApplicationStatusDTO {
  applicationId: string;
  recruiterId: string;
  status:
    | ApplicationStatus.SHORTLISTED
    | ApplicationStatus.REJECTED
    | ApplicationStatus.SELECTED;

  rejectionReason?: string;
}
