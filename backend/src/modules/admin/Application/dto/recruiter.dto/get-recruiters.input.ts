import { VerificationStatus } from "../../../Domain/entities/recruiter.entity"; 

export interface GetRecruitersInput {
  search?: string;
  verificationStatus?: VerificationStatus;
  subscriptionStatus?: string;
  isActive?: boolean;
  skip: number;
  limit: number;
  sort?: "latest" | "oldest";
}
