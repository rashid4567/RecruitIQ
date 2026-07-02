import {
  CandidateResponseStatus,
  InterviewMode,
  InterviewStatus,
} from "../../domain/entity/interview.entity";

export interface GetCandidateInterviewsRequestDTO {
  candidateId: string;
}

export interface CandidateInterviewDTO {
  id: string;
  applicationId: string;
  jobId: string;
  title: string;
  round: number;
  mode: InterviewMode;
  status: InterviewStatus;
  candidateResponseStatus: CandidateResponseStatus;
  rescheduleRequested: boolean;
  scheduledAt: Date;
  durationInMinutes: number;
  meetingLink?: string;
  location?: string;
  canJoin: boolean;
  createdAt?: Date;
}

export interface GetCandidateInterviewsResponseDTO {
  interviews: CandidateInterviewDTO[];
}

export interface CandidateInterviewDetailsRequestDTO {
  interviewId: string;
  candidateId: string;
}

export interface CandidateInterviewDetailsResponseDTO {
  id: string;
  applicationId: string;
  jobId: string;
  recruiterId: string;
  roomId?: string;
  title: string;
  description?: string;
  round: number;
  mode: InterviewMode;
  status: InterviewStatus;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt?: Date;
  candidateResponseMessage?: string;
  rescheduleRequested: boolean;
  requestedReason?: string;
  rescheduleRequestedAt?: Date;
  scheduledAt: Date;
  durationInMinutes: number;
  meetingLink?: string;
  location?: string;
  recruiterJoinedAt?: Date;
  candidateJoinedAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  notes?: string;
  reminderSent: boolean;
  canJoin: boolean;
  canCancel: boolean;
  canReschedule: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
