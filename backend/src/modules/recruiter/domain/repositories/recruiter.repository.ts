import { RecruiterProfile } from "../entities/recruiter-profile.entity";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";

export interface RecruiterProfileRepository {
  findByUserId(userId: UserId): Promise<RecruiterProfile | null>;
  save(profile: RecruiterProfile): Promise<void>;
}
