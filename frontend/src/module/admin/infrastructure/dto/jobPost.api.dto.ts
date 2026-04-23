export interface JobPostApiDto {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
  isRemote: boolean;
  jobType: "full-time" | "part-time" | "contract" | "internship";
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  department: string;
  positions: number;
  visibility: "active" | "hidden";
  isBlocked: boolean;
  status: "draft" | "active" | "expired";
  postedOn?: string;
  expiresAt?: string;
  externalLink?: string;
  views: number;
  applicationsCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}