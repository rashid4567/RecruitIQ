import type { SubscriptionStatus } from "../../Domain/constatns/subscribtionStatus";
import type { VerificationStatus } from "../../Domain/constatns/verificationStatus";
import { RecruiterProfile } from "../../Domain/entities/recruiterEntities";

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

export class RecruiterProfileMapper {
  static toDomain(dto: RecruiterProfileDto): RecruiterProfile {
    const { user, recruiter } = dto;

    return new RecruiterProfile({
      fullName: user.fullName,
      email: user.email,
      companyName: recruiter.companyName,
      companyWebsite: recruiter.companyWebsite,
      companySize: recruiter.companySize,
      industry: recruiter.industry,
      location: recruiter.location,
      bio: recruiter.bio,
      designation: recruiter.designation,
      linkedinUrl: recruiter.linkedinUrl,
      subscriptionStatus: recruiter.subscriptionStatus,
      verificationStatus: recruiter.verificationStatus,
      jobPostsUsed: recruiter.jobPostsUsed,
    });
  }
}