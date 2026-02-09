import type { Recruiter } from "../entities/recruiter.entity";
import type { VerificationStatus } from "../entities/recruiter.entity";

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

  getProfile(recruiterId: string): Promise<Recruiter>;

  updateVerificationStatus(
    recruiterId: string,
    status: VerificationStatus,
  ): Promise<void>;
}
