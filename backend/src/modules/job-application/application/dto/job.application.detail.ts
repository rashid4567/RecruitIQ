import {
  ApplicationStatus,
  InterviewInfo,
} from "../../domain/entity/job-application.entity";

export interface RecruiterApplicationDetailsOutput {
  applicationId: string;
  applicationNumber: string;    
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
  appliedAt: Date;
  updatedAt: Date;
}
