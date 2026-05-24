export const AccountStatus = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];