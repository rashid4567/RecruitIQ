import type { JobPost } from "../entities/jobPost.entity";
import type { CreateJobPostDTO } from "../dto/jobPost.dto";
import type { UpdateJobPostDTO } from "../dto/updateJobPost.dto";

export interface JobPostRepository {
  createJobPost(data: CreateJobPostDTO): Promise<JobPost>;

  getJobPosts(): Promise<JobPost[]>;

  getJobPostById(id: string): Promise<JobPost>;

  updateJobPost(id: string, data: UpdateJobPostDTO): Promise<JobPost>;

  hideJobPost(id: string): Promise<JobPost>;

  unhideJobPost(id: string): Promise<JobPost>;
}
