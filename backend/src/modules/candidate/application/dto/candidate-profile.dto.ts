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
  preferredJobLocations: string[];
  bio: string;
  profileCompleted: boolean;
  currentJobLocation : string,
  gender : string,
  linkedinUrl : string,
  portfolioUrl : string
}

export interface GetCandidateProfileResponseDTO {
  user: UserProfileDTO;
  candidateProfile: CandidateProfileDTO;
}
