import type { CandidateProfile } from "../../domain/entities/candidateProfile";

export interface CandidateProfileResponse {
  user: {
    fullName: string;
    email: string;
    profileImage?: string;
    emailVerified: boolean;
  };
  candidateProfile: CandidateProfile;
  profileCompleted?: boolean;
}

export interface ProfileStats {
  experienceYears: number;
  skillsCount: number;
  completionPercentage: number;
}