import type { Job } from "../entity/jobPost.entity";
import type { CreateJobDTO } from "../dto/jobPost.dto";
import type { JobPostFilters } from "../dto/JobPostDTO";

export interface PaginatedJobs {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobPostRepository {
  createJobPost(data: CreateJobDTO): Promise<Job>;
  getJobPosts(filters?: JobPostFilters): Promise<PaginatedJobs>;
  getJobPostById(id: string): Promise<Job>;
  updateJobPost(id: string, data: Job): Promise<Job>;
  hideJobPost(id: string): Promise<Job>;
  unhideJobPost(id: string): Promise<Job>;
  publish(id: string): Promise<Job>;
  deleteJobPost(id: string): Promise<void>;
  blockJobPost(id: string): Promise<Job>;
  unblockJobPost(id: string): Promise<Job>;
}
