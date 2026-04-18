export type JobType = "full-time" | "part-time" | "contract" | "internship";

export type JobStatus = "draft" | "active";

export interface LocationDTO {
  city?: string;
  state?: string;
  country?: string;
}

export interface SalaryDTO {
  min?: number;
  max?: number;
  currency?: string;
}

export interface CreateJobPostDTO {
  title: string;
  description: string;

  responsibilities?: string[];
  requirements?: string[];

  requiredSkills?: string[];
  preferredSkills?: string[];

  experienceMin: number;
  experienceMax: number;

  location?: LocationDTO;
  isRemote?: boolean;

  jobType: JobType;

  salary?: SalaryDTO;

  department?: string;
  positions?: number;

  status?: JobStatus;

  expiresAt?: Date;
  externalLink?: string;
}
