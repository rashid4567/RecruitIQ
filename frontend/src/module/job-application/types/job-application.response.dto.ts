import type {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationRecommendation,
  ApplicationStatus,
  InterviewSummary,
} from "./jobApplication.types";

export interface JobApplicationResponseDTO {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  jobTitle?: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  appliedResumeFileName?: string;
  appliedResumeFileKey?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  interview?: InterviewSummary;
  rejectionReason?: string;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: string;
  updatedAt: string;
}

export interface RecruiterApplicationResponseDTO {
  applicationId: string;
  applicationNumber: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  jobTitle: string;
  resumeId: string;
  appliedResumeFileName: string;
  status: ApplicationStatus;
  aiScore?: number;
  aiRecommendation?: ApplicationRecommendation;
  appliedAt: string;
}