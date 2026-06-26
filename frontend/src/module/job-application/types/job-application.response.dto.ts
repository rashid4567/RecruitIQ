import type {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationRecommendation,
  ApplicationStatus,
  InterviewInfo,
} from "./jobApplication.types";

export interface JobApplicationResponseDTO {
  applicationId: string;
  jobId: string;
  jobTitle?: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  resumeFileName?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  interview?: InterviewInfo;
  rejectionReason?: string;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: string;
  updatedAt: string;
}

export interface RecruiterApplicationResponseDTO {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  resumeId: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  aiScore?: number;
  aiRecommendation?: ApplicationRecommendation;
  appliedAt: string;
}
