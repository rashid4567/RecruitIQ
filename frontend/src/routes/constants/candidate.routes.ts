export const CANDIDATE_ROUTES = {
  HOME: "/candidate/home",

  COMPLETE_PROFILE: "/candidate/profile/complete",
  PROFILE_SETTINGS: "/candidate/profile/setting",

  NOTIFICATIONS: "/candidate/notification",

  JOBS: "/candidate/jobs",

  APPLICATIONS: "/candidate/applications",
  APPLICATION_DETAILS: (applicationId: string) =>
    `/candidate/applications/${applicationId}`,

  INTERVIEWS: "/candidate/interviews",
  INTERVIEW_DETAILS: (interviewId: string) =>
    `/candidate/interview/${interviewId}`,

  INTERVIEW_LOBBY: (interviewId: string) =>
    `/candidate/interviews/${interviewId}/lobby`,

  INTERVIEW_ROOM: (interviewId: string) =>
    `/candidate/interviews/${interviewId}/room`,
} as const;
