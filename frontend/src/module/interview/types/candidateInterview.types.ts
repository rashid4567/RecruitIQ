import type {
  CandidateResponseStatus,
  InterviewMode,
  InterviewStatus,
} from "./interview.types";

export interface CandidateInterviewItem {
  id: string;
  applicationId: string;
  jobId: string;
  title: string;
  round: number;
  mode: InterviewMode;
  status: InterviewStatus;
  candidateResponseStatus: CandidateResponseStatus;
  rescheduleRequested: boolean;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  meetingLink?: string;
  canJoin: boolean;
  createdAt?: string;
}

export type GetCandidateInterviewsResponse = CandidateInterviewItem;

export interface GetCandidateInterviewDetailsResponse {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  title: string;
  description?: string;
  round: number;
  mode: InterviewMode;
  status: InterviewStatus;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt?: string;
  candidateResponseMessage?: string;
  rescheduleRequested: boolean;
  requestedReason?: string;
  rescheduleRequestedAt?: string;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  meetingLink?: string;
  startedAt?: string;
  endedAt?: string;
  recruiterJoinedAt?: string;
  candidateJoinedAt?: string;
  notes?: string;
  cancelledReason?: string;
  cancelledBy?: string;
  reminderSent: boolean;
  canJoin?: boolean;
  canCancel?: boolean;
  canReschedule?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinInterviewResponse {
  id: string;
  candidateJoinedAt: string;
  status: InterviewStatus;
  updatedAt?: string;
}

export interface AcceptInterviewResponse {
  id: string;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt: string;
  updatedAt?: string;
}

export interface RejectInterviewRequest {
  reason: string;
}

export interface RejectInterviewResponse {
  id: string;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt: string;
  candidateResponseMessage?: string;
  updatedAt?: string;
}

export interface RequestInterviewRescheduleRequest {
  reason: string;
}

export interface RequestInterviewRescheduleResponse {
  id: string;
  rescheduleRequested: boolean;
  requestedReason: string;
  rescheduleRequestedAt: string;
  updatedAt?: string;
}