import { VerificationStatus } from "../../Domain/constatns/recruiterVerification-status";

export interface RecruiterAggregate {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  verificationStatus: VerificationStatus;
}
