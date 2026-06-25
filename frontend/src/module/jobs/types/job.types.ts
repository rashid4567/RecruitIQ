import type { JobStatus, JobType, JobVisibility } from "./jobPost.dto";
import type { LocationDTO, SalaryDTO } from "./shared.dto";

export interface Job {
  id: string;
  recruiterId: string;
  companyName: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  location: LocationDTO;
  isRemote: boolean;
  jobType: JobType;
  salary: SalaryDTO;
  department: string;
  positions: number;
  visibility: JobVisibility;
  status: JobStatus;
  isBlocked: boolean;
  isDeleted: boolean;
  views: number;
  applicationsCount: number;
  publicationCount: number;
  externalLink?: string;
  postedOn?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}