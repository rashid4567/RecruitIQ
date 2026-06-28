export const INTERVIEW_ROUTES = {
  SCHEDULE: "/applications/:applicationId/interview",
  BY_ID: "/:interviewId",
  UPCOMING_RECRUITER: "/recruiter/upcoming",
  UPCOMING_CANDIDATE: "/candidate/upcoming",
  RESCHEDULE: "/:interviewId/reschedule",
  CANCEL: "/:interviewId/cancel",
  JOIN: "/:interviewId/join",
  START: "/:interviewId/start",
  COMPLETE: "/:interviewId/complete",
} as const;