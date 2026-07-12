export const RECRUITER_APPLICATION_ROUTES = {
  ALL_APPLICATIONS: "/recruiter/jobs/applications",
  JOB_APPLICATIONS: (jobId: string) => `/recruiter/jobs/${jobId}/applications`,
  APPLICATION: (applicationId: string) =>
    `/recruiter/jobs/applications/${applicationId}`,
  UPDATE_STATUS: (applicationId: string) =>
    `/recruiter/jobs/applications/${applicationId}/status`,
} as const;