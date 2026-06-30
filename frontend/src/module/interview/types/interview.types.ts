import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";

export const InterviewMode = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
} as const;
export type InterviewMode = (typeof InterviewMode)[keyof typeof InterviewMode];

export const InterviewStatus = {
  SCHEDULED: "SCHEDULED",
  RESCHEDULED: "RESCHEDULED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;
export type InterviewStatus =
  (typeof InterviewStatus)[keyof typeof InterviewStatus];

export interface ScheduleInterviewRequest {
  applicationId: string;
  round?: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  meetingRoom?: string;
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
  meetingRoom?: string;
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
  meetingRoom?: string;
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
  meetingRoom?: string;
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
