export const JOB_APPLICATION_ROUTES = {
  CANDIDATE: {
    ROOT: "/",
    APPLY: "/:jobId/apply",
    WITHDRAW: "/:applicationId/withdraw",
    DETAILS: "/:applicationId",
  },

  RECRUITER: {
    ALL_APPLICATIONS: "/applications",
    JOB_APPLICATIONS: "/:jobId/applications",
    APPLICATION_DETAILS: "/applications/:applicationId",
    UPDATE_STATUS: "/applications/:applicationId/status",
  },
} as const;