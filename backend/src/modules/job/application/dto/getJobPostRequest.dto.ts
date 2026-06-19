import { JobFilters } from "../../domain/types/job-filter.type";

export interface GetJobsRequestDTO {
  filters: JobFilters;
  page?: number;
  limit?: number;
}