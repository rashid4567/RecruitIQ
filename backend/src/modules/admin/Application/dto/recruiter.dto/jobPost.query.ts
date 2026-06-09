import { JobStatus, JobType } from "../../../../job/domain/entities/job.entity";
import { SortField } from "../../../../job/domain/types/job-filter.type";


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