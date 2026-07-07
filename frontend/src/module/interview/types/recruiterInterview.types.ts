import type { ApplicationRecommendation, ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import type {
  CandidateResponseStatus,
  InterviewMode,
  InterviewStatus,
} from "./interview.types";

export interface ScheduleInterviewRequest {
  applicationId: string;
  round?: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
}

export interface ScheduleInterviewResponse {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  round: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  status: InterviewStatus;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  reminderSent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecruiterInterviewItem {
  interviewId?: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  recruiterId: string;
  applicationStatus: ApplicationStatus;
  interviewStatus?: InterviewStatus;
  candidateResponseStatus: CandidateResponseStatus;
  rescheduleRequested: boolean;
  mode: InterviewMode;
  title?: string;
  round?: number;
  scheduledAt?: string;
  durationInMinutes?: number;
  location?: string;
  roomId?: string;
}
export type GetRecruiterInterviewsResponse = RecruiterInterviewItem;
export interface GetRecruiterInterviewDetailsResponse {
  interviewId: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  applicationStatus: ApplicationStatus;
  interviewStatus: InterviewStatus;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt?: string;
  candidateResponseMessage?: string;
  rescheduleRequested: boolean;
  requestedReason?: string;
  rescheduleRequestedAt?: string;
  title: string;
  description?: string;
  round: number;
  mode: InterviewMode;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  startedAt?: string;
  endedAt?: string;
  recruiterJoinedAt?: string;
  candidateJoinedAt?: string;
  notes?: string;
  cancelledReason?: string;
  cancelledBy?: string;
  reminderSent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RescheduleInterviewRequest {
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
}

export interface RescheduleInterviewResponse {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  round: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  status: InterviewStatus;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  reminderSent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CancelInterviewRequest {
  reason: string;
}

export interface CancelInterviewResponse {
  id: string;
  status: InterviewStatus;
  cancelledReason: string;
  cancelledBy: string;
  updatedAt?: string;
}

export interface StartInterviewResponse {
  roomId: string;
  id: string;
  status: InterviewStatus;
  startedAt: string;
  updatedAt?: string;
}

export interface MarkRecruiterJoinedResponse {
  id: string;
  roomId: string;
  recruiterJoinedAt: string;
  status: InterviewStatus;
  updatedAt?: string;
}

export interface EndInterviewResponse {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  round: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  status: InterviewStatus;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  notes?: string;
  reminderSent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApproveRescheduleResponse {
  id: string;
  rescheduleRequested: boolean;
  updatedAt?: string;
}

export interface RejectRescheduleResponse {
  id: string;
  rescheduleRequested: boolean;
  updatedAt?: string;
}

export interface UpdateInterviewNotesRequest {
  notes: string;
}

export interface UpdateInterviewNotesResponse {
  id: string;
  notes: string;
  updatedAt?: string;
}


export interface GetRecruiterHiringDecisionDetailsResponse {
  application: HiringDecisionApplication;
  interview: HiringDecisionInterview;
  job: HiringDecisionJob;
  resume: HiringDecisionResume;
}

export interface HiringDecisionApplication {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  recruiterId: string;
  candidateId: string;
  resumeId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  status: string;
  analysisStatus: string;
  coverLetter?: string;
  rejectionReason?: string;
  aiAnalysis?: HiringDecisionAIAnalysis;
  appliedAt: string;
  updatedAt: string;
}

export interface HiringDecisionAIAnalysis {
  overallScore: number;
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  requirementsScore: number;
  educationScore: number;
  strengths: string[];
  gaps: string[];
  missingCriticalSkills: string[];
  recommendation: ApplicationRecommendation,
  summary: string;
  analyzedAt: string;
}

export interface HiringDecisionInterview {
  interviewId: string;
  title: string;
  description?: string;
  round: number;
  mode: string;
  status: string;
  candidateResponseStatus?: string;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  startedAt?: string;
  endedAt?: string;
  recruiterJoinedAt?: string;
  candidateJoinedAt?: string;
  notes?: string;
  completed: boolean;
}

export interface HiringDecisionJob {
  jobId: string;
  title: string;
}

export interface HiringDecisionParsedResume {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  skills: string[];
  education: string[];
  experience: string[];
  totalExperienceYears?: number | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  currentCompany?: string | null;
  currentRole?: string | null;
}

export interface HiringDecisionResume {
  resumeId: string;
  fileName: string;
  previewUrl: string;
  uploadedAt: string;
  parseStatus:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";
  parsedData?: HiringDecisionParsedResume;
}