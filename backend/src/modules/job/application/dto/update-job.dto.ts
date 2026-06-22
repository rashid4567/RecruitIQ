import {
  JobType,
  JobLocation,
  JobSalary,
} from "../../domain/entities/job.entity";

export const JobStatus = {
  Draft: "draft",
  Active: "active",
  Expired: "expired",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export interface UpdateJobDTO {
  companyName?: string;
  title?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  experienceMin?: number;
  experienceMax?: number;
  location?: JobLocation;
  isRemote?: boolean;
  jobType?: JobType;
  salary?: JobSalary;
  department?: string;
  positions?: number;
  expiresAt?: Date;
  externalLink?: string;
}

export interface UpdateJobPostRequestDTO {
  jobId: string;
  recruiterId: string;
  dto: UpdateJobDTO;
}
