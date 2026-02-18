import { VerificationStatus } from "../../../Domain/entities/recruiter.entity";

export interface RecruiterProfileOutput {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  verificationStatus:VerificationStatus;
  company: string;
  subscriptionStatus: string;
  jobPostsUsed: number;
  joinedDate: Date;
}
