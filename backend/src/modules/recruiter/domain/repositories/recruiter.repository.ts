import { RecruiterProfile } from "../entities/recruiter-profile.entity";
import { UserId } from "../value.object.ts/user-Id.vo";

export interface RecruiterProfileRepository {
  findByUserId(userId: UserId): Promise<RecruiterProfile | null>;
  save(profile: RecruiterProfile): Promise<void>;
}
