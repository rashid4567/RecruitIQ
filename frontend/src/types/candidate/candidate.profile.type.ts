export interface UpdateCandidateProfilePayload {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocations?: string[];
  currentJobLocation?: string;
  linkedinUrl?: string;
  gender?: string;
  bio?: string;
  portfolioUrl?: string;
}

export interface CompleteCandidateProfileRequest {
  currentJob: string;
  experienceYears?: number;
  skills: string[];
  educationLevel: string;
  preferredJobLocations: string[];
  bio: string;
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}



export interface CandidateProfileData {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocations?: string[];
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
   bio?:string;
  profileCompleted: boolean;

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




export type UpdateCandidateProfileRequest =
  UpdateUserProfilePayload & UpdateCandidateProfilePayload;
