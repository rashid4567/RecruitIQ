export const OTP_ROLES = {
  CANDIDATE: "candidate",
  RECRUITER: "recruiter",
} as const;

export type OtpRole = typeof OTP_ROLES[keyof typeof OTP_ROLES];