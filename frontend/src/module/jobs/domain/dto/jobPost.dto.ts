import type {
  LocationDTO,
  SalaryDTO,
} from "./shared.dto";

export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";

export type JobStatus =
  | "draft"
  | "active"
  | "expired";

export type JobVisibility =
  | "active"
  | "hidden";

export interface CreateJobDTO {
  title: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  experienceMin: number;
  experienceMax: number;
  location?: Partial<LocationDTO>;
  isRemote?: boolean;
  jobType: JobType;
  salary?: Partial<SalaryDTO>;
  department?: string;
  positions?: number;
  expiresAt?: Date;
  externalLink?: string;
}