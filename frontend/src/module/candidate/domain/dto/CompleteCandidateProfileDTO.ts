import type { Gender } from "../types/gender.types";

export interface CompleteCandidateProfileDTO {
 currentJobLocation?: string;
  gender?: Gender;
  currentJob: string;
  experienceYears?: number;
  educationLevel: string;
  skills: string[];
  preferredJobLocations: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio: string;
}
