import type {
  VerificationStatus,
  SubscriptionStatus,
} from "../../domain/entities/recruiter.entity";

export interface RecruiterApiDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;

  // Profile fields
  companyName?: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  designation?: string;
  location?: string;
  linkedinUrl?: string;
  bio?: string;

  // Status fields
  verificationStatus: VerificationStatus;
  subscriptionStatus: SubscriptionStatus;
  jobPostsUsed: number;
  joinedDate: string;
}