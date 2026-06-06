import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import { ApplicationStatus, JobApplication } from "../entity/job-application.entity";

export interface ApplyJobDTO {
  jobId: string;
  resumeId: string;
  coverLetter?: string;
}
export interface RecruiterApplication {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  resumeId: string;
  status: ApplicationStatus;
  appliedAt: string;
}
export interface ApplicationDetailDTO {
  application: JobApplication;
  job: Job;
}

export interface JobApplicationRepository {
  apply(data: ApplyJobDTO): Promise<JobApplication>;
  getMyApplications(): Promise<JobApplication[]>;
  getApplicationsByJob(
    jobId: string,
  ): Promise<RecruiterApplication[]>;
  getById(applicationId: string): Promise<ApplicationDetailDTO>;
  withdraw(applicationId: string): Promise<void>;
}
