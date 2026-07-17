import { JobProps } from "../../domain/entities/job.entity";
import { JobFilters } from "../../domain/types/job-filter.type";

export interface CandidateJobResponse extends JobProps {
  isApplied: boolean;
}

export interface GetJobsRequestDTO {
  filters: JobFilters;
  page?: number;
  limit?: number;
  candidateId: string;
}