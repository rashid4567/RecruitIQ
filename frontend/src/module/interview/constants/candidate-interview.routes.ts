export const CANDIDATE_INTERVIEW_ROUTES = {
  INTERVIEWS: "/candidate/interviews",
  INTERVIEW: (interviewId: string) => `/candidate/interviews/${interviewId}`,
  JOIN: (interviewId: string) => `/candidate/interviews/${interviewId}/join`,
  ACCEPT: (interviewId: string) =>
    `/candidate/interviews/${interviewId}/accept`,
  REJECT: (interviewId: string) =>
    `/candidate/interviews/${interviewId}/reject`,
  REQUEST_RESCHEDULE: (interviewId: string) =>
    `/candidate/interviews/${interviewId}/request-reschedule`,
} as const;
