import { GetRecruitersInput } from "../../Application/dto/recruiter.dto/get-recruiters.input";
import { Recruiter } from "../entities/recruiter.entity";

import { VerificationStatus } from "../entities/recruiter.entity";

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
