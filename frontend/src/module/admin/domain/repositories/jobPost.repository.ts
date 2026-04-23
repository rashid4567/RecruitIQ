import type { JobPostEntity } from "../entities/jobpost.entity";
import type { JobPostQuery } from "../types/jobPost.types";

export interface JobPostRepository {
  getJobPosts(query: JobPostQuery): Promise<{
    jobPosts: JobPostEntity[];
    total: number;
  }>;

  getJobPostById(jobPostId: string): Promise<JobPostEntity>;
  blockJobPost(jobPostId: string): Promise<void>;
  unblockJobPost(jobPostId: string): Promise<void>;
}
