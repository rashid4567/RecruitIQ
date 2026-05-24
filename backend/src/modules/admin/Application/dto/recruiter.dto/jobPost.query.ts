import { JobStatus, JobType } from "../../../Domain/entities/jobPost-entity";
import { SortField } from "../../../Domain/repositories/jobPost-repository";


export class GetJobPostsQuery {
  search?: string;
  status?: JobStatus;
  isBlocked?: boolean;
  jobType?: JobType;
  recruiterId?: string;
  location?: string;
  postedAfter?: Date;
  postedBefore?: Date;
  sortField?: SortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}