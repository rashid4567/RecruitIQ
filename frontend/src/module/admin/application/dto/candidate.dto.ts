export type CandidateStatus = "Active" | "Blocked";

export interface CandidateListItem {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  registeredDate: string;
}


export interface CandidateListResponse {
  candidates: CandidateListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}


export interface GetCandidatesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "All" | CandidateStatus;
}


export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  verified: boolean;
  status: CandidateStatus;

  jobTitle?: string;
  location?: string;

  registeredDate: string;
  lastActive: string;
  summary: string;

  statistics: {
    applications: number;
    interviews: number;
    completeness: number;
  };

  skills: string[];

  education: {
    degree: string;
    school: string;
    description: string;
  }[];

  experience: {
    title: string;
    company: string;
    description: string;
  }[];

  riskFlags: string[];

  aiAnalysis: {
    technical: number;
    experience: number;
    education: number;
    overall: number;
  };
}
