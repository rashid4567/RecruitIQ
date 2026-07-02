export const RESUME_ROUTES = {
  UPLOAD: "/candidate/resume/upload",
  MY_RESUME: "/candidate/resume/me",
  DOWNLOAD: (resumeId: string) =>
    `/candidate/resume/${resumeId}/download`,
} as const;