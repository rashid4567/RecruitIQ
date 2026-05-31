import type {
  JobStatus,
  JobType,
  JobVisibility,
} from "../../domain/dto/jobPost.dto";

import type {
  LocationDTO,
  SalaryDTO,
} from "../../domain/dto/shared.dto";

export interface JobApiProps {
  id?: string;
  _id?: string;
  recruiterId: string;
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
  isBlocked: boolean;
  status: JobStatus;
  postedOn?: string;
  expiresAt?: string;
  externalLink?: string;
  views: number;
  applicationsCount: number;
  publicationCount: number;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WrappedJobResponse {
  props: JobApiProps;
}