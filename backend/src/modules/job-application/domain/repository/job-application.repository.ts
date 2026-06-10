import { JobApplication } from "../entity/job-application.entity";
import {
  ApplicationStatus,
  InterviewInfo,
} from "../../domain/entity/job-application.entity";

export interface RecruiterApplicationListItem {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  resumeId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  interview?: InterviewInfo;
}

export interface RecruiterApplicationDetailsOutput {
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
  appliedAt: Date;
  updatedAt: Date;
}
export interface JobApplicationRepository {
  create(application: JobApplication): Promise<JobApplication>;
  save(application: JobApplication): Promise<JobApplication>;
  findById(id: string): Promise<JobApplication | null>;
  findByJob(jobId: string): Promise<JobApplication[]>;
  findApplicationsWithCandidateDetails(
    jobId: string,
  ): Promise<RecruiterApplicationListItem[]>;
  findByCandidate(candidateId: string): Promise<JobApplication[]>;
  findByRecruiter(recruiterId: string): Promise<JobApplication[]>;
  findExistingApplication(
    candidateId: string,
    jobId: string,
  ): Promise<JobApplication | null>;
  findApplicationDetailsForRecruiter(
  applicationId: string,
): Promise<RecruiterApplicationDetailsOutput | null>;
}
