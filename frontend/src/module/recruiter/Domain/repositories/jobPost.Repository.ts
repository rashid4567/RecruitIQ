import type { JobPost } from "../entities/jobPost.entity";
import type { CreateJobPostDTO } from "../dto/jobPost.dto";

export interface JobPostRepository {
  createJobPost(data: CreateJobPostDTO): Promise<JobPost>;

  getJobPosts(): Promise<JobPost[]>;

  getJobPostById(id: string): Promise<JobPost>;

  updateJobPost(id: string, data: JobPost): Promise<JobPost>;

  hideJobPost(id: string): Promise<JobPost>;

  unhideJobPost(id: string): Promise<JobPost>;

  deleteJobPost(id : string):Promise<void>
}
