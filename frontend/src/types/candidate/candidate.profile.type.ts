export interface UpdateCandidateProfilePayload {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocation?: string[];
  currentJobLocation?: string;
  linkedinUrl?: string;
  gender?: string;
   bio?:string;
  portfolioUrl?: string;
}

export interface CandidateProfileData {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocation?: string[];
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
   bio?:string;
  profileCompleted?: boolean;
}

export interface CandidateProfileResponse {
  user: {
    emailVerified: boolean;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  candidateProfile: CandidateProfileData;
}


export interface UpdateUserProfilePayload {
  fullName?: string;
  profileImage?: string;
}


export interface UpdateCandidateProfilePayload {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocation?: string[];
  currentJobLocation?: string;
  linkedinUrl?: string;
  gender?: string;
  bio?:string;
  portfolioUrl?: string;
}


export type UpdateCandidateProfileRequest =
  UpdateUserProfilePayload & UpdateCandidateProfilePayload;
