import { VerificationStatus } from "../../../Domain/entities/recruiter.entity";

export interface GetRecruitersQuery {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: VerificationStatus;
  subscriptionStatus?: string;
  isActive?: boolean;
  sort?: "latest" | "oldest";
}
``