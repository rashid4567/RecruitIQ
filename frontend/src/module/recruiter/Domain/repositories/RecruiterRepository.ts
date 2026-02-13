import type { RecruiterProfile } from "../entities/recruiterEntities";


export interface RecruiterRepository {
  getProfile(): Promise<RecruiterProfile>;
  updateProfile(profile: RecruiterProfile): Promise<RecruiterProfile>;
  completeProfile(profile: RecruiterProfile): Promise<RecruiterProfile>;
}