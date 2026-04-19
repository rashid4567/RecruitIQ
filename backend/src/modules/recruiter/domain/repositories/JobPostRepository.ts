import { JobPost } from "../entities/job-post.entity";

export interface JobPostRepository {
  create(jobPost: JobPost): Promise<JobPost>;
  findById(id: string): Promise<JobPost | null>;
  findAllByRecruiter(recruiterId: string): Promise<JobPost[]>;
  save(jobPost: JobPost): Promise<JobPost>;
  delete(id : string):Promise<void>;
}