import { RecruiterProfile } from "../entities/recruiter-profile.entity";

export interface RecruiterProfileRepository {
  findByUserId(userId: string): Promise<RecruiterProfile | null>;
  createIfNotExists(userId: string): Promise<RecruiterProfile>;
  updateByUserId(
    userId: string,
    data: Partial<RecruiterProfile>
  ): Promise<RecruiterProfile | null>;
}
