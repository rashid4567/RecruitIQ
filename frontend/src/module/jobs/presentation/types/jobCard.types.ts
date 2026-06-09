export interface JobCardProps {
  id: string;
  companyName : string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: "Active" | "Paused" | "Expired" | "Draft" | "Blocked";
  visibility: "active" | "hidden";
  isBlocked: boolean;
  location: string;
  isRemote: boolean;
  jobType: string;
  salary: string;
  positions: number;
  experienceMin: number;
  experienceMax: number;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
  expiresDate: string;
  externalLink: string | null;
  views: number;
  applications: number;
  publicationCount: number;
  shortlisted: number;
  avgAiScore: number;
  positionsFilled: number;
  applicants?: Applicant[];
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  aiScore: number;
  appliedDate: string;
  status: "pending" | "shortlisted" | "rejected" | "interviewed";
}

export type ViewMode = "grid" | "list";
