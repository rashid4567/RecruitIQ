export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";

export type JobVisibility =
  | "active"
  | "hidden";

export type JobStatus =
  | "draft"
  | "published"
  | "closed"
  | "expired";

export interface SalaryApiResponse {
  min: number;
  max: number;
  currency: string;
}

export interface JobPostApiResponse {
  _id?: string;
  id?: string;
  recruiterId: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills?: string[];
  experienceMin: number;
  experienceMax: number;
  location: string;
  isRemote: boolean;
  jobType: JobType;
  salary?: SalaryApiResponse;
  department?: string;
  positions: number;
  visibility?: JobVisibility;
  isBlocked?: boolean;
  status: JobStatus;
  externalLink?: string;
  views?: number;
  applicationsCount?: number;
  postedOn?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}