import type { JobType } from "./jobPost.dto";
import type { LocationDTO, SalaryDTO } from "./shared.dto"; 




export interface UpdateJobPostDTO {
  companyName ?: string;
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
  expiresAt?: Date;
  externalLink?: string;
}