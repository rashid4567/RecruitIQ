import type { Role } from "../api/job.api";

export const JOB_ROUTES = {
  CREATE: (role: Role) => `/${role}/jobs/create`,
  JOBS: (role: Role) => `/${role}/jobs`,
  JOB: (role: Role, id: string) => `/${role}/jobs/${id}`,
  PUBLISH: (role: Role, id: string) => `/${role}/jobs/${id}/publish`,
  HIDE: (role: Role, id: string) => `/${role}/jobs/${id}/hide`,
  UNHIDE: (role: Role, id: string) => `/${role}/jobs/${id}/unhide`,
  BLOCK: (id: string) => `/admin/jobs/${id}/block`,
  UNBLOCK: (id: string) => `/admin/jobs/${id}/unblock`,
} as const;
