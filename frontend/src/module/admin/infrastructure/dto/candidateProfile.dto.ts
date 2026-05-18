

export interface CandidatePaginationApiDto {
  page: number;
  limit: number;
  total: number;
}

export interface CandidateResponseApiDto {
  candidates: CandidateListApiDto[];
  pagination: CandidatePaginationApiDto;
}
export interface CandidateListApiDto {
  id: unknown;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  currentJob?: string;
  experienceYears?: number | { value: number };
  educationLevel?: string;
  skills?: string[];
  preferredJobLocations?: string[];
  bio?: string;
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileCompleted?: boolean;
}

export interface CandidateProfileApiDto {
  id: unknown;
  name: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  currentJob?: string;
  experienceYears?: number | { value: number };
  educationLevel?: string;
  skills?: string[];
  preferredJobLocations?: string[];
  bio?: string;
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileCompleted?: boolean;
}