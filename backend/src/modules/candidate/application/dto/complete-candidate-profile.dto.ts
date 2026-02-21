import { Gender } from "../../domain/type/gender.Types";

export interface CompleteCandidateProfileDTO {
  skills: string[];
  educationLevel: string;
  preferredJobLocations: string[];
  bio: string;
  currentJobLocation?: string;
  gender?: Gender;
  linkedinUrl?: string;
  portfolioUrl?: string;
}
