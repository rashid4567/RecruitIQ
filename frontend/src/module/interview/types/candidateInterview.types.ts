import type { InterviewMode, InterviewStatus } from "./interview.types";

export interface CandidateInterviewItem {
  id: string;
  applicationId: string;
  jobId: string;

  title: string;
  round: number;

  mode: InterviewMode;
  status: InterviewStatus;

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

  createdAt?: string;
  updatedAt?: string;
}

export interface JoinInterviewResponse {
  id: string;
  candidateJoinedAt: string;
  status: InterviewStatus;
  updatedAt?: string;
}