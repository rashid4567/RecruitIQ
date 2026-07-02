export const SUBSCRIPTION_ROUTES = {
  PLANS: "/admin/plans",
  PLAN: (planId: string) => `/admin/plans/${planId}`,
  HIDE_PLAN: (planId: string) => `/admin/plans/${planId}/hide`,
  UNHIDE_PLAN: (planId: string) => `/admin/plans/${planId}/unhide`,
  SUBSCRIBERS: "/admin/subscribers",
} as const;
