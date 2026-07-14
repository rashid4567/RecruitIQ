import {
  ApplicationRecommendation,
  ApplicationStatus,
} from "../../domain/entity/job-application.entity";

export interface GetRecruiterApplicationsRequestDTO {
  recruiterId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  recommendation?: ApplicationRecommendation;
  sortBy?: "appliedAt" | "candidateName" | "aiScore";
  sortOrder?: "asc" | "desc";
}

export interface RecruiterApplicationSummaryDTO {
  applicationId: string;
  applicationNumber: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  jobTitle: string;
  resumeId: string;
  appliedResumeFileName: string;
  status: ApplicationStatus;
  aiScore?: number;
  aiRecommendation?: ApplicationRecommendation;
  appliedAt: Date;
}

export interface GetRecruiterApplicationsResponseDTO {
  applications: RecruiterApplicationSummaryDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}