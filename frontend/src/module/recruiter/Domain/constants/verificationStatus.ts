export const VERIFICATION_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type VerificationStatus =
  typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];
