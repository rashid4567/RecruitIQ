import {
  CandidateResponseStatus,
  InterviewMode,
  InterviewStatus,
} from "../../domain/entity/interview.entity";

export interface GetRecruiterInterviewDetailsRequestDTO {
  recruiterId: string;
  interviewId: string;
}

export interface GetRecruiterInterviewDetailsResponseDTO {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  roomId?: string;
  round: number;
  title: string;
  description?: string;
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
  location?: string;
  meetingLink?: string;
  startedAt?: Date;
  endedAt?: Date;
  recruiterJoinedAt?: Date;
  candidateJoinedAt?: Date;
  notes?: string;
  cancelledReason?: string;
  cancelledBy?: string;
  reminderSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
