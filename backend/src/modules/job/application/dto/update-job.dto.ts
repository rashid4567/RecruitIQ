import {
  JobType,
  JobLocation,
  JobSalary,
} from "../../domain/entities/job.entity";

export interface UpdateJobDTO {
  companyName ?: string;
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

export interface UpdateJobPostRequestDTO{
    jobId: string,
    recruiterId: string,
    dto: UpdateJobDTO,
}
