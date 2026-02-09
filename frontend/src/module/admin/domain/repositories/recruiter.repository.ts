import type { VerificationStatus } from "@/types/admin/recruiter.types";
import type { Recruiter } from "../entities/recruiter.entity";

export interface RecruiterRepository {
  getRecruiters(query: {
    page: number;
    limit: number;
    search?: string;
    verificationStatus?: VerificationStatus;
    isActive?: boolean;
  }): Promise<{
    recruiters: Recruiter[];
    total: number;
  }>;

  updateVerificationStatus(
    recruiterId: string,
    status: VerificationStatus
  ): Promise<void>;
}
