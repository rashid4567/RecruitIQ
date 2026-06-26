import { ApplicationStatus } from "./jobApplication.types";

export interface UpdateApplicationStatusDTO {
  applicationId: string;
  status:
    | typeof ApplicationStatus.SHORTLISTED
    | typeof ApplicationStatus.INTERVIEW_SCHEDULED
    | typeof ApplicationStatus.SELECTED
    | typeof ApplicationStatus.REJECTED;

  rejectionReason?: string;
}
