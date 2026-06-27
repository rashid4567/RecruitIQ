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
export type JobStatus = "draft" | "active" | "expired";
export type JobVisibility = "active" | "hidden";
export interface JobFormData {
  companyName : string;
  title: string;
  description: string;
  department: string;
  positions: number;
  jobType: JobType;
  isRemote: boolean;
  location: LocationVO;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  salary: SalaryVO;
  externalLink: string;
  expiresAt: string;
}

export const defaultJobFormData: JobFormData = {
  companyName : "",
  title: "",
  description: "",
  department: "",
  positions: 1,
  jobType: "full-time",
  isRemote: false,
  location: { city: "", state: "", country: "" },
  responsibilities: [],
  requirements: [],
  requiredSkills: [],
  preferredSkills: [],
  experienceMin: 0,
  experienceMax: 0,
  salary: { min: 0, max: 0, currency: "INR" },
  externalLink: "",
  expiresAt: "",
};
