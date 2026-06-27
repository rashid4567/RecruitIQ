export type Gender = "male" | "female" | "other";


export interface Resume {
  id?: string;
  candidateId: string;
  fileName: string;
  fileKey: string;
  uploadedAt: string;
}

export interface CandidateProfile {
  fullName: string;
  email: string;
  emailVerified: boolean;
  profileImage?: string;
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills: string[];
  preferredJobLocations: string[];
  currentJobLocation?: string;
  gender?: Gender;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  resume?: Resume | null;
  profileCompleted: boolean;
}

export interface CompleteCandidateProfilePayload {
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

export interface UpdateCandidateProfilePayload {
  fullName?: string;
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocations?: string[];
  currentJobLocation?: string;
  gender?: Gender;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
}

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

export interface CompleteCandidateProfileForm {
  currentJob: string;
  experienceYears?: number | string;
  educationLevel: string;
  skills: string[];
  preferredJobLocations?: string;
  bio: string;
  linkedinUrl?: string;
}

export interface CandidateProfileApiResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    emailVerified?: boolean;
    profileImage?: string;
  };

  candidateProfile: {
    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    currentJobLocation?: string;

    gender?: Gender;   

    linkedinUrl?: string;
    portfolioUrl?: string;
    bio?: string;
    profileCompleted: boolean;
    resume?: Resume | null;
  };
}