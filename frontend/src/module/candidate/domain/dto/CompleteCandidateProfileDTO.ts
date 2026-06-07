import type { Gender } from "../types/gender.types";

export interface CompleteCandidateProfileDTO {
  currentJob: string;
  experienceYears?: number;
  educationLevel: string;
  skills: string[];
  preferredJobLocations: string[];
  bio: string;
  currentJobLocation?: string;
  gender?: Gender;
  linkedinUrl?: string;
  portfolioUrl?: string;
}