export interface CompleteCandidateProfileForm {
  currentJob: string;
  experienceYears?: number | string;
  educationLevel: string;
  skills: string[];
  preferredJobLocations?: string;
  bio: string;
  linkedinUrl?: string;
}
