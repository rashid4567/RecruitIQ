export const ADMIN_ROUTES = {
  LOGIN: "/admin/login",

  DASHBOARD: "/admin/dashboard",

  RECRUITERS: "/admin/recruiters",
  RECRUITER_DETAILS: (id: string) => `/admin/recruiters/${id}`,

  CANDIDATES: "/admin/candidates",
  CANDIDATE_DETAILS: (candidateId: string) =>
    `/admin/candidates/${candidateId}`,

  EMAIL_TEMPLATES: "/admin/email-templates",
  CREATE_EMAIL_TEMPLATE: "/admin/email-templates/create",
  EDIT_EMAIL_TEMPLATE: (id: string) => `/admin/email-templates/edit/${id}`,
  EMAIL_TEMPLATE_DETAILS: (id: string) => `/admin/email-templates/${id}`,

  EMAIL_LOGS: "/admin/email-logs",
  ACTIVITY_LOGS: "/admin/activity-logs",

  JOB_POSTS: "/admin/jobPosts",

  PLANS: "/admin/plans",
  CREATE_PLAN: "/admin/plans/create",
  EDIT_PLAN: (id: string) => `/admin/plans/edit/${id}`,

  SUBSCRIBERS: "/admin/subscribers",
} as const;
