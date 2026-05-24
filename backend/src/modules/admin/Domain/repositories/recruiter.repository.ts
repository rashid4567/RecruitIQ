
import { Recruiter } from "../entities/recruiter.entity";
import {AccountStatus} from "../constatns/verification.status"
import { VerificationStatus } from "../entities/recruiter.entity";

export interface GetRecruitersInput {
  search?: string;
  verificationStatus?: AccountStatus;
  subscriptionStatus?: string;
  isActive?: boolean;
  skip: number;
  limit: number;
  sort?: "latest" | "oldest";
}

export interface RecruiterRepository {

  getRecruiters(
    input: GetRecruitersInput
  ): Promise<{
    recruiters: Recruiter[];
    total: number;
  }>;

  findById(
    recruiterId: string
  ): Promise<Recruiter | null>;

  verifyRecruiter(
    recruiterId: string,
    status: VerificationStatus
  ): Promise<void>;
}
