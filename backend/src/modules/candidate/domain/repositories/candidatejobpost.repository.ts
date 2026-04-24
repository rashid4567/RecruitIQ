import { JobPostEntity } from "../entities/jobPost.entity";

export interface FindAllJobPostOptions {
  page: number;
  limit: number;
  search?: string;
  jobType?: string;
  isRemote?: boolean;
  skills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  department?: string;
}

export interface PaginatedJobPosts {
  data: JobPostEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CandidateJobPostRepository {
  findAll(options: FindAllJobPostOptions): Promise<PaginatedJobPosts>;
  findById(id: string): Promise<JobPostEntity | null>;
  incrementViews(id: string): Promise<void>;
}
