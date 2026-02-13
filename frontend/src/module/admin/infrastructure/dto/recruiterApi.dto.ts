import type {
  VerificationStatus,
  SubscriptionStatus,
} from "../../domain/entities/recruiter.entity";

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
