export const InterviewMode = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
} as const;

export type InterviewMode =
  (typeof InterviewMode)[keyof typeof InterviewMode];

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

export const CandidateResponseStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
} as const;

export type CandidateResponseStatus =
  (typeof CandidateResponseStatus)[keyof typeof CandidateResponseStatus];