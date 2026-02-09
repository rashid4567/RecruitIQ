import type {
  SubscriptionStatus,
  VerificationStatus,
} from "@/types/admin/recruiter.types";

export interface RecruiterApiDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  companyName?: string;
  verificationStatus: VerificationStatus;
  subscriptionStatus: SubscriptionStatus;
  jobPostsUsed: number;
  joinedDate: string;
}
