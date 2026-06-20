export const JOB_ROUTES = {
  COMMON: {
    ROOT: "/",
    BY_ID: "/:jobId",
  },

  ADMIN: {
    ROOT: "/",
    BY_ID: "/:jobPostId",
    BLOCK: "/:jobPostId/block",
    UNBLOCK: "/:jobPostId/unblock",
  },

  CANDIDATE: {
    ROOT: "/",
    BY_ID: "/:jobId",
  },

  RECRUITER: {
    CREATE: "/create",
    ROOT: "/",
    BY_ID: "/:jobId",
    PUBLISH: "/:jobId/publish",
    HIDE: "/:jobId/hide",
    UNHIDE: "/:jobId/unhide",
  },
} as const;
