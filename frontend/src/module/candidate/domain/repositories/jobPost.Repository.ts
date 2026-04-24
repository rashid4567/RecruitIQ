import type { JobPostFilters, PaginatedJobPosts } from "../dto/JobPostDTO";
import type { JobPost } from "../entities/jobPost";

export interface jobPostRepository {
  getAll(filter: JobPostFilters): Promise<PaginatedJobPosts>;
  getById(id: string): Promise<JobPost>;
}
