import {
  InterviewMode,
  InterviewStatus,
} from "../../domain/entity/interview.entity";

export interface EndInterviewRequestDTO {
  interviewId: string;
  recruiterId: string;
  notes?: string;
}

export interface EndInterviewResponseDTO {
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
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  durationInMinutes: number;
  location?: string;
  notes?: string;
  reminderSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}