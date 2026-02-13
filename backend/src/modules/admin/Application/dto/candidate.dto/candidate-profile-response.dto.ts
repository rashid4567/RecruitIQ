
export interface CandidateProfileResponseDTO {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
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