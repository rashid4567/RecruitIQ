import {
  InterviewMode,
  InterviewStatus,
} from "../../domain/entity/interview.entity";

export interface RescheduleInterviewRequestDTO {
  interviewId: string;
  recruiterId: string;
  roomId ?: string;
  scheduledAt: Date;
  durationInMinutes: number;
  location?: string;
}

export interface RescheduleInterviewResponseDTO {
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
  durationInMinutes: number;
  location?: string;
  reminderSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}