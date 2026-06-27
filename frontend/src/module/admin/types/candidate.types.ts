export type CandidateStatus = "Active" | "Blocked";

export interface CandidateListItem {
  id: string;
  name: string;
  email: string;
isActive : boolean;
  profileImage?: string;

  status: CandidateStatus;
  registeredDate: string;

  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;

  skills: string[];
  preferredJobLocations: string[];

  bio?: string;
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileCompleted?: boolean;
}

export interface CandidateProfile extends CandidateListItem {}

export interface CandidateListResponse {
  candidates: CandidateListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CandidateQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}