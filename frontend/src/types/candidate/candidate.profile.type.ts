export interface UpdateCandidateProfilePayload {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocation?: string[];
  currentJobLocation?: string;
  linkedinUrl?: string;
  gender?: string;
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
  profileCompleted?: boolean;
}

export interface CandidateProfileResponse {
  user: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
  candidateProfile: CandidateProfileData;
}
