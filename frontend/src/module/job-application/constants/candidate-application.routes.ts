export const CANDIDATE_APPLICATION_ROUTES = {
  APPLICATIONS: "/candidate/application",
  APPLY: (jobId: string) => `/candidate/application/${jobId}/apply`,
  APPLICATION: (applicationId: string) =>
    `/candidate/application/${applicationId}`,
  WITHDRAW: (applicationId: string) =>
    `/candidate/application/${applicationId}/withdraw`,
} as const;
