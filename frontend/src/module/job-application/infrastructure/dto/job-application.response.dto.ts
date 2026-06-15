import type {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationRecommendation,
  ApplicationStatus,
  InterviewInfo,
} from "../../domain/entity/job-application.entity";

export interface JobApplicationResponseDTO {
  id: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
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
  analysisStatus : ApplicationAnalysisStatus;
  aiScore?: number;
  aiRecommendation?: ApplicationRecommendation;
  appliedAt: string;
}
