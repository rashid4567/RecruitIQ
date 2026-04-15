import type { RecruiterProfile } from "../entities/recruiterEntities";
import type { CompleteRecruiterProfileDTO } from "../dto/completeProfile.dto";
import type { UpdateRecruiterProfileDTO } from "../dto/updateRecruiterProfile.dto";

export interface RecruiterRepository {
  getProfile(): Promise<RecruiterProfile>;

  updateProfile(data: UpdateRecruiterProfileDTO): Promise<RecruiterProfile>;

  completeProfile(data: CompleteRecruiterProfileDTO): Promise<RecruiterProfile>;
}
