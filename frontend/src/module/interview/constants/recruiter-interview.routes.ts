export const RECRUITER_INTERVIEW_ROUTES = {
  INTERVIEWS: "/recruiter/interviews",
  INTERVIEW: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}`,
  RESCHEDULE: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/reschedule`,
  CANCEL: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/cancel`,
  START: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/start`,
  JOIN: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/join`,
  END: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/end`,
  UPDATE_NOTES: (interviewId: string) =>
  `/recruiter/interviews/${interviewId}/notes`,
  APPROVE_RESCHEDULE: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/approve-reschedule`,
  REJECT_RESCHEDULE: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/reject-reschedule`,
} as const;