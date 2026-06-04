import { JobApplication } from "../entity/job-application.entity";

export interface JobApplicationRepository {
  create(application: JobApplication): Promise<JobApplication>;
  save(application: JobApplication): Promise<JobApplication>;
  findById(id: string): Promise<JobApplication | null>;
  findByJob(jobId: string): Promise<JobApplication[]>;
  findByCandidate(candidateId: string): Promise<JobApplication[]>;
  findByRecruiter(recruiterId: string): Promise<JobApplication[]>;
  findExistingApplication(
    candidateId: string,
    jobId: string,
  ): Promise<JobApplication | null>;
}
