import { verificationStatus } from "../../../../recruiter/domain/constatns/verificationStatus.constants";

export interface GetRecruitersQuery {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: verificationStatus;
  subscriptionStatus?: string;
  isActive?: boolean;
  sort?: "latest" | "oldest";
}
