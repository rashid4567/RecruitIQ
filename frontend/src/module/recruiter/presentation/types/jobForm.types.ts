export interface LocationVO {
  city: string;
  state: string;
  country: string;
}

export interface SalaryVO {
  min: number;
  max: number;
  currency: string;
}

export type JobType = "full-time" | "part-time" | "contract" | "internship";

export interface JobFormData {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  location: LocationVO;
  isRemote: boolean;
  jobType: JobType;
  salary: SalaryVO;
  department: string;
  positions: number;
  expiresAt: string;
  externalLink: string;
}