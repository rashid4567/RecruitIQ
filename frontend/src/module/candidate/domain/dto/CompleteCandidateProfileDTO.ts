export interface CompleteCandidateProfileDTO {
  currentJob: string;
  experienceYears?: number;
  educationLevel: string;
  skills: string[];
  preferredJobLocations: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio: string;
}