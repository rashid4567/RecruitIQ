import { JobType } from "../../domain/entities/job.entity";

export interface CreateJobDTO {
  companyName: string;
  title: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  experienceMin: number;
  experienceMax: number;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  isRemote?: boolean;
  jobType: JobType;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  department?: string;
  positions?: number;
  expiresAt?: Date;
  externalLink?: string;
}

export interface createJobPostRequestDTO {
  recruiterId: string;
  dto: CreateJobDTO;
}
