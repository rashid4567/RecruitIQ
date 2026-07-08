import { VerificationStatus } from "../../Domain/constatns/recruiterVerification-status";
import { SubscriptionStatus } from "../../Domain/entities/recruiter.entity";

export interface RecruiterAggregate {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  profileImage?: string;
  verificationStatus: VerificationStatus;
  subscriptionStatus: SubscriptionStatus;
}
