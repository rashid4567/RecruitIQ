import type { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import type { InterviewMode, InterviewStatus } from "./interview.types";

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
  meetingLink?: string;
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
  meetingLink?: string;
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
  title?: string;
  round?: number;
  scheduledAt?: string;
  durationInMinutes?: number;
  location?: string;
  roomId?: string;
  meetingLink?: string;
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
  title: string;
  description?: string;
  round: number;
  mode: InterviewMode;
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

export interface RescheduleInterviewRequest {
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  meetingLink?: string;
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
  meetingLink?: string;
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
  id: string;
  status: InterviewStatus;
  startedAt: string;
  updatedAt?: string;
}

export interface MarkRecruiterJoinedResponse {
  id: string;
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
  meetingLink?: string;
  notes?: string;
  reminderSent: boolean;
  createdAt?: string;
  updatedAt?: string;
}