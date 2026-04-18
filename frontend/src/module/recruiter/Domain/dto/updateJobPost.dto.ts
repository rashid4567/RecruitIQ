import type { JobType } from "./jobPost.constants";


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

export interface UpdateJobPostDTO {
  title?: string;
  description?: string;

  responsibilities?: string[];
  requirements?: string[];

  requiredSkills?: string[];
  preferredSkills?: string[];

  experienceMin?: number;
  experienceMax?: number;

  location?: LocationDTO;
  isRemote?: boolean;

  jobType?: JobType;

  salary?: SalaryDTO;

  department?: string;
  positions?: number;

  // ⚠️ Controlled updates only
  status?: "draft" | "active";

  expiresAt?: Date;
  externalLink?: string;
}