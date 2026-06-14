import { ApplicationStatus } from "../entity/job-application.entity";

export interface UpdateApplicationStatusDTO {
  applicationId: string;
  status:
    | typeof ApplicationStatus.SHORTLISTED
    | typeof ApplicationStatus.INTERVIEW_SCHEDULED
    | typeof ApplicationStatus.SELECTED
    | typeof ApplicationStatus.REJECTED;

  rejectionReason?: string;
}