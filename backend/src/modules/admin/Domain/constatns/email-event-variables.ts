
export const EMAIL_EVENT_VARIABLES: Record<string, string[]> = {
  ACCOUNT_CREATED: ["name", "email"],
  JOB_APPLIED: ["name", "jobTitle", "companyName", "appliedDate"],
  INTERVIEW_SCHEDULED: ["name", "jobTitle", "interviewDate", "interviewLink"],
  SELECTED: ["name", "jobTitle", "companyName"],
  REJECTED: ["name", "jobTitle", "companyName"],
  SUBSCRIPTION_EXPIRING: ["name", "expiryDate", "planName"],
  SUBSCRIPTION_EXPIRED: ["name", "expiredDate", "planName", "renewLink"],
};