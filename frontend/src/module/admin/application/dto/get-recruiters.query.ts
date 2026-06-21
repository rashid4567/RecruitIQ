import type { VerificationStatus } from "@/module/admin/application/dto/recruiter.dto";


export interface GetRecruitersQuery {
  page: number;
  limit: number;
  search?: string;
  verificationStatus?: VerificationStatus;
  isActive?: boolean;
  profileImage ?: string;
}
