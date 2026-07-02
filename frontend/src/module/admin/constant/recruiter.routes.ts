export const RECRUITER_ROUTES = {
  GET_RECRUITERS: "/admin/recruiters",

  GET_RECRUITER_PROFILE: (recruiterId: string) =>
    `/admin/recruiters/${recruiterId}`,

  VERIFY_RECRUITER: (recruiterId: string) =>
    `/admin/recruiters/${recruiterId}/verify`,

  REJECT_RECRUITER: (recruiterId: string) =>
    `/admin/recruiters/${recruiterId}/reject`,

  TOGGLE_RECRUITER_STATUS: (recruiterId: string) =>
    `/admin/recruiters/${recruiterId}/status`,
} as const;