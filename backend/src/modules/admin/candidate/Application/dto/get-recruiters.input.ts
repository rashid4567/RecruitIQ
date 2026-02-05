import { verificationStatus } from "../../../../recruiter/domain/constatns/verificationStatus.constants";

export interface GetRecruitersInput {
  search?: string;
  verificationStatus?: verificationStatus;
  subscriptionStatus?: string;
  isActive?: boolean;
  skip: number;
  limit: number;
  sort?: "latest" | "oldest";
}
