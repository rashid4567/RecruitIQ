import { Recruiter } from "../entities/recruiter.entity";
import { AccountStatus } from "../constatns/verification.status";
import { VerificationStatus } from "../entities/recruiter.entity";
import { BaseRepository } from "../../../../shared/repositories/base.repository";

export interface GetRecruitersInput {
  search?: string;
  verificationStatus?: AccountStatus;
  subscriptionStatus?: string;
  isActive?: boolean;
  skip: number;
  limit: number;
  sort?: "latest" | "oldest";
}

export interface RecruiterRepository extends BaseRepository<Recruiter> {
  getRecruiters(input: GetRecruitersInput): Promise<{
    recruiters: Recruiter[];
    total: number;
  }>;

  verifyRecruiter(
    recruiterId: string,
    status: VerificationStatus,
  ): Promise<void>;
}
