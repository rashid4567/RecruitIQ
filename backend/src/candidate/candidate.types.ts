import { Types } from "mongoose";


export interface UpdateCandidateProfileInput {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocation?: string[];
  currentJobLocation?: string;
  gender?: string;
  bio?:string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface UpdateUserProfileInput {
  fullName?: string,
  profileImage?:string,
}

export interface CandidateProfile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  profileCompleted: boolean;
}
