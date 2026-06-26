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
  interviewId: string;
  scheduledAt: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
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
