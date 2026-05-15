export const subscriptionStatus = {
  FREE: "free",
  ACTIVE: "active",
  EXPIRED: "expired",
};

export type subscriptionStatus =
  (typeof subscriptionStatus)[keyof typeof subscriptionStatus];
