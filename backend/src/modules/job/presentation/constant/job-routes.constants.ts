export const JOB_ROUTES = {
  COMMON: {
    ROOT: "/",
    BY_ID: "/:id",
  },

  ADMIN: {
    ROOT: "/",
    BY_ID: "/:jobPostId",
    BLOCK: "/:jobPostId/block",
    UNBLOCK: "/:jobPostId/unblock",
  },

  CANDIDATE: {
    ROOT: "/",
    BY_ID: "/:id",
  },

  RECRUITER: {
    CREATE: "/create",
    ROOT: "/",
    BY_ID: "/:id",
    PUBLISH: "/:id/publish",
    HIDE: "/:id/hide",
    UNHIDE: "/:id/unhide",
    CLOSE : "/:id/close"
  },
} as const;
