export const SUBSCRIPTION_ROUTES = {
  ADMIN: {
    PLANS: "/plans",
    PLAN_DETAIL: "/plans/:planId",
    HIDE_PLAN: "/plans/:planId/hide",
    UNHIDE_PLAN: "/plans/:planId/unhide",
    SUBSCRIBERS: "/subscribers",
  },
  RECRUITER: {
    PLANS: "/plans",
    PLAN_DETAIL: "/plans/:planId",
    SUBSCRIBE: "/subscribe/:planId",
    CURRENT_SUBSCRIPTION: "/subscriptions/current",
    UPGRADE: "/subscription/upgrade",
    PAYMENT_ORDER: "/payment/order",
    PAYMENT_VERIFY: "/payment/verify",
    RENEW: "/renew",
    CANCEL: "/cancel",
  },
} as const;
