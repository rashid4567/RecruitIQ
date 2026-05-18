import type { LocationVO, SalaryVO } from "../presentation/types/jobForm.types";

export type JobType = "full-time" | "part-time" | "contract" | "internship";

export type JobVisibility = "active" | "hidden";

export type JobStatus = "draft" | "active" | "expired";

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
  location?: Partial<LocationVO>;
  isRemote: boolean;
  jobType: JobType;
  salary?: Partial<SalaryVO>;
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
