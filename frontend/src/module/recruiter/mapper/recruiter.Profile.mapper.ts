import type { SubscriptionStatus } from "@/module/subscription/constant/subscription.constants";
import type { VerificationStatus } from "../constants/status";
import type { RecruiterProfile, RecruiterProfileResponse } from "../types/recruiter.types";

interface UserDto {
  fullName: string;
  email: string;
}

interface RecruiterDto {
  companyName?: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;
  linkedinUrl?: string;
  subscriptionStatus?: SubscriptionStatus;
  verificationStatus?: VerificationStatus;
  jobPostsUsed?: number;
}

interface RecruiterProfileDto {
  user: UserDto;
  recruiter: RecruiterDto;
}

export function mapRecruiterProfile(
  response: RecruiterProfileResponse,
): RecruiterProfile {
  return {
    fullName: response.user.fullName,
    email: response.user.email,
    profileImage: response.user.profileImage,
    companyName: response.recruiter.companyName,
    companyWebsite: response.recruiter.companyWebsite,
    companySize: response.recruiter.companySize,
    industry: response.recruiter.industry,
    location: response.recruiter.location,
    bio: response.recruiter.bio,
    designation: response.recruiter.designation,
    linkedinUrl: response.recruiter.linkedinUrl,
    subscriptionStatus: response.recruiter.subscriptionStatus,
    verificationStatus: response.recruiter.verificationStatus,
    jobPostsUsed: response.recruiter.jobPostsUsed,
  };
}