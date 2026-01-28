export interface CompleteCandidateProfileDTO {
  skills: string[];
  educationLevel: string;
  preferredJobLocations: string[];
  bio: string;
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}
