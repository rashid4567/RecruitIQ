export const INTERVIEW_ROUTES = {
  SCHEDULE: "/",
  GET_INTERVIEWS: "/",
  GET_INTERVIEW_DETAILS: "/:interviewId",
  RESCHEDULE: "/:interviewId/reschedule",
  CANCEL: "/:interviewId/cancel",
  START: "/:interviewId/start",
  END: "/:interviewId/end",
  JOIN: "/:interviewId/join",
} as const;