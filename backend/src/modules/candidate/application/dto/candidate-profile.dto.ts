import { Gender } from "../../domain/type/gender.Types";
import { ParsedResumeData } from "../../../resume/domain/entity/resume.entity";

export interface UserProfileDTO {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

export interface ResumeDTO {
  id?: string;
  candidateId: string;
  fileName: string;
  fileKey: string;
  uploadedAt: Date;
  parsedData?: ParsedResumeData;
}

export interface CandidateProfileDTO {
  currentJob: string;
  experienceYears?: number;
  skills: string[];
  educationLevel: string;
  preferredJobLocations: string[];
  bio: string;
  profileCompleted: boolean;
  currentJobLocation: string;
  gender?: Gender;
  linkedinUrl: string;
  portfolioUrl: string;
  resume: ResumeDTO | null;
}

export interface GetCandidateProfileResponseDTO {
  user: UserProfileDTO;
  candidateProfile: CandidateProfileDTO;
}