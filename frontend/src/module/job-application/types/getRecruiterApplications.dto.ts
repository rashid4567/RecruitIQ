import type { RecruiterApplication } from "./application.types";
import type {
  ApplicationRecommendation,
  ApplicationStatus,
} from "./jobApplication.types";
import type { RecruiterApplicationResponseDTO } from "./job-application.response.dto";

export interface GetRecruiterApplicationsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  recommendation?: ApplicationRecommendation;
  sortBy?: "appliedAt" | "candidateName" | "aiScore";
  sortOrder?: "asc" | "desc";
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetRecruiterApplicationsResponse {
  success: boolean;
  data: {
    applications: RecruiterApplicationResponseDTO[];
    pagination: Pagination;
  };
}

export interface GetRecruiterApplicationsResult {
  applications: RecruiterApplication[];
  pagination: Pagination;
}
