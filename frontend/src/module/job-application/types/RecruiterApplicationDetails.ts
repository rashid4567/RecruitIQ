import type {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationStatus,
  InterviewInfo,
} from "../types/jobApplication.types";

export interface RecruiterApplicationDetails {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateProfileImage?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  interview?: InterviewInfo;
  rejectionReason?: string;
  analysisStatus: ApplicationAnalysisStatus;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: string;
  updatedAt: string;
}
