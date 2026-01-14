// recruiter.types.ts

export type VerificationStatus = "pending" | "verified" | "rejected";
export type SubscriptionStatus = "free" | "active" | "expired";

export interface RecruiterListQuery {
  page?: string;
  limit?: string;
  search?: string;
  verificationStatus?: VerificationStatus;
  subscriptionStatus?: SubscriptionStatus;
  isActive?: string;
  sort?: string; // latest | oldest
}
