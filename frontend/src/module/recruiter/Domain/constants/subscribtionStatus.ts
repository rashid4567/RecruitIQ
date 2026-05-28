export const SUBSCRIPTION_STATUS = {
  FREE: "free",
  ACTIVE: "active",
  EXPIRED: "expired",
} as const;

export type SubscriptionStatus =
  typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
