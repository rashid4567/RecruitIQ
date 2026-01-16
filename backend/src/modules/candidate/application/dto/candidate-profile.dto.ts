export interface UserProfileDTO {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

export interface CandidateProfileDTO {
  currentJob: string;
  experienceYears?: number;
  skills: string[];
  educationLevel: string;
  preferredJobLocation: string[];
  bio: string;
  profileCompleted: boolean;
}

export interface GetCandidateProfileResponseDTO {
  user: UserProfileDTO;
  candidateProfile: CandidateProfileDTO;
}
