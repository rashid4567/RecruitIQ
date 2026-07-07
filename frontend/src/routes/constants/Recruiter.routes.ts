export const RECRUITER_ROUTES = {
  HOME: "/recruiter",

  COMPLETE_PROFILE: "/recruiter/complete-profile",
  PROFILE: "/recruiter/profile",

  NOTIFICATIONS: "/recruiter/notification",

  JOBS: "/recruiter/jobs",

  JOB_EDITOR: "/recruiter/job-editor",
  EDIT_JOB: (jobId: string) => `/recruiter/job-editor/${jobId}`,

  PLANS: "/recruiter/plans",

  SUBSCRIPTION_SUCCESS: "/recruiter/subscription/success",
  SUBSCRIPTION_FAILED: "/recruiter/subscription/failed",

  CURRENT_SUBSCRIPTION: "/recruiter/current-subscription",

  JOB_APPLICATIONS: (jobId: string) =>
    `/recruiter/jobs/${jobId}/applications`,

  APPLICATION_DETAILS: (applicationId: string) =>
    `/recruiter/application-detail/${applicationId}`,

  INTERVIEWS: "/recruiter/interviews",

  INTERVIEW_LOBBY: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/lobby`,

  INTERVIEW_ROOM: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/room`,

  SCREENING_COMPLETE: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/screening-complete`,

  HIRING_DECISION: (interviewId: string) =>
    `/recruiter/interviews/${interviewId}/hiring-decision`,
} as const;