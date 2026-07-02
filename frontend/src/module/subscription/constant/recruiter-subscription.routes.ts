export const RECRUITER_SUBSCRIPTION_ROUTES = {
  CURRENT: "/recruiter/subscriptions/current",
  HISTORY: "/recruiter/subscriptions/history",
  SUBSCRIBE: "/recruiter/subscriptions/subscribe",
  UPGRADE: "/recruiter/subscription/upgrade",
  CANCEL: "/recruiter/subscriptions/cancel",
  CHANGE_PLAN: "/recruiter/subscriptions/change-plan",
  RENEW: (subscriptionId: string) =>
    `/recruiter/subscriptions/${subscriptionId}/renew`,
  TRACK_USAGE: "/recruiter/subscriptions/track-usage",
} as const;