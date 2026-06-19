import { CandidateProfile } from "../../domain/entities/candidate-profile.entity";
import { User } from "../../domain/entities/user.entity";
import { Gender } from "../../domain/type/gender.Types";

export interface UpdateCandidateProfileResult {
  user: User;
  profile: CandidateProfile;
}
export interface UpdateCandidateProfileDTO {
  fullName?: string;
  profileImage?: string;
  currentJob?: string;
  experienceYears?: number;
  skills?: string[];
  educationLevel?: string;
  preferredJobLocations?: string[];
  bio?: string;
  currentJobLocation?: string;
  gender?: Gender;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface UpdateCandidateProfileRequestDTO {
  userId: string;
  profile: UpdateCandidateProfileDTO;
}
