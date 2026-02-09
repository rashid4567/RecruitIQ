import type { VerificationStatus } from "@/types/admin/recruiter.types";


export interface GetRecruitersQuery {
  page: number;
  limit: number;
  search?: string;
  verificationStatus?: VerificationStatus
  isActive?: boolean;
}
