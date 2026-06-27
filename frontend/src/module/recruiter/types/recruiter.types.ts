import type { SubscriptionStatus } from "@/module/subscription/domain/constant/subscription.constants";
import type { VerificationStatus } from "../constants/status";

export interface RecruiterProfile {
  fullName: string;
  email: string;
  profileImage?: string;

  companyName?: string;
  companyWebsite?: string;
  companySize?: number;

  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;
  linkedinUrl?: string;

  subscriptionStatus: SubscriptionStatus;
  verificationStatus: VerificationStatus;

  jobPostsUsed: number;
}

export interface RecruiterProfileResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };

  recruiter: {
    companyName?: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    location?: string;
    bio?: string;
    designation?: string;
    linkedinUrl?: string;

    subscriptionStatus: SubscriptionStatus;
    verificationStatus: VerificationStatus;
    jobPostsUsed: number;
  };
}

export interface UpdateRecruiterProfileDTO {
  fullName?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  designation?: string;
  location?: string;
  bio?: string;
  linkedinUrl?: string;
}

export interface CompleteRecruiterProfileDTO {
  companyName: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  designation?: string;
  location?: string;
  bio?: string;
}