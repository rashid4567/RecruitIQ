// ============================================================
// APPLICATION LAYER — DTOs
// Data Transfer Objects: shapes data crossing layer boundaries.
// ============================================================

// ── Request DTOs ─────────────────────────────────────────────

export interface GetAllJobPostsRequestDTO {
  page?: number;
  limit?: number;
  search?: string;
  jobType?: string;
  location?: string;
  isRemote?: boolean;
  skills?: string[];       // comma-separated string parsed before reaching here
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  department?: string;
}

export interface GetJobPostByIdRequestDTO {
  id: string;
}

// ── Response DTOs ─────────────────────────────────────────────

export interface JobLocationDTO {
  city: string;
  state: string;
  country: string;
}

export interface JobSalaryDTO {
  min: number;
  max: number;
  currency: string;
}

export interface JobPostSummaryDTO {
  id: string;
  title: string;
  department: string;
  jobType: string;
  location: JobLocationDTO;
  isRemote: boolean;
  salary: JobSalaryDTO;
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  positions: number;
  applicationsCount: number;
  postedOn?: string;       // ISO string
  expiresAt?: string;
}

export interface JobPostDetailDTO extends JobPostSummaryDTO {
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredSkills: string[];
  externalLink?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedJobPostsResponseDTO {
  data: JobPostSummaryDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}