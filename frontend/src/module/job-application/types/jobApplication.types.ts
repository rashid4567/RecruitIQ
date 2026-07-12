import type { Job } from "@/module/jobs/types/job.types";
import type { OfferStatus } from "@/module/offer-letter/types/candidateOffer.types";
import type { CandidateApplication } from "./application.types";
import type { InterviewStatus } from "@/module/interview/types/interview.types";

export const ApplicationStatus = {
  APPLIED: "APPLIED",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  SELECTED: "SELECTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;
export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const ApplicationAnalysisStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
} as const;

export type ApplicationAnalysisStatus =
  (typeof ApplicationAnalysisStatus)[keyof typeof ApplicationAnalysisStatus];

export const ApplicationRecommendation = {
  STRONG_MATCH: "STRONG_MATCH",
  GOOD_MATCH: "GOOD_MATCH",
  PARTIAL_MATCH: "PARTIAL_MATCH",
  POOR_MATCH: "POOR_MATCH",
} as const;

export type ApplicationRecommendation =
  (typeof ApplicationRecommendation)[keyof typeof ApplicationRecommendation];

export interface InterviewInfo {
  id: string;
  status: InterviewStatus;
  scheduledAt: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}
export interface InterviewSummary {
  id: string;
  scheduledAt : Date;
  status: InterviewStatus;
  completed: boolean;
}

export interface SkillScore {
  name: string;
  score: number;
}

export interface ApplicationAIAnalysis {
  overallScore: number;
  recommendation: ApplicationRecommendation;
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  requirementsScore: number;
  educationScore: number;
  strengths: string[];
  gaps: string[];
  missingCriticalSkills: string[];
  summary: string;
  analyzedAt: Date;
}

export interface JobApplication {
  id: string;
  applicationNumber: string;
  jobId: string;
  jobTitle?: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  resumeFileName?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  aiAnalysis?: ApplicationAIAnalysis;
  interview?: InterviewInfo;
  rejectionReason?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface OfferSummary {
  id: string;
  status: OfferStatus;
  expiryDate: string;
  offerLetterUrl: string;
}

export interface ApplicationDetailData {
  application: CandidateApplication;
  job: Job;
  offer?: OfferSummary;
}
