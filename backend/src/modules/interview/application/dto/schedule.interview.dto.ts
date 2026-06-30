import {
  InterviewMode,
  InterviewStatus,
} from "../../domain/entity/interview.entity";

export interface ScheduleInterviewRequestDTO {
  applicationId: string;
  recruiterId: string;
  roomId?: string;
  round?: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  scheduledAt: Date;
  durationInMinutes: number;
  location?: string;
  meetingLink?: string;
}

export interface ScheduleInterviewResponseDTO {
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
  meetingLink?: string;
  reminderSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
