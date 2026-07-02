export const RECRUITER_PLAN_ROUTES = {
  PLANS: "/recruiter/plans",
  PLAN: (planId: string) => `/recruiter/plans/${planId}`,
} as const;
