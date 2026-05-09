export interface JobPostApiResponse {
  _id?: string;
  id?: string;
  recruiterId: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills?: string[];
  experienceMin: number;
  experienceMax: number;
  location: string;
  isRemote: boolean;
  jobType: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  department?: string;
  positions: number;
  visibility?: string;
  isBlocked?: boolean;
  status: string;
  externalLink?: string;
  views?: number;
  applicationsCount?: number;
  postedOn?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}