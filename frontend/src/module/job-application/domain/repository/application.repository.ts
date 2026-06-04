import { JobApplication } from "../entity/job-application.entity";

export interface ApplyJobDTO {
  jobId: string;
  resumeId: string;
  coverLetter?: string;
}

export interface JobApplicationRepository {
  apply(data: ApplyJobDTO): Promise<JobApplication>;
//   getMyApplications(): Promise<JobApplication[]>;
//   getById(applicationId: string): Promise<JobApplication>;
//   withdraw(applicationId: string): Promise<void>;
}
