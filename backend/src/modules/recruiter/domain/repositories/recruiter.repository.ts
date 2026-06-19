import { RecruiterProfile } from "../entities/recruiter-profile.entity";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { BaseRepository } from "../../../../shared/repositories/base.repository";

export interface RecruiterProfileRepository extends BaseRepository<RecruiterProfile> {
  findByUserId(userId: UserId): Promise<RecruiterProfile | null>;
  save(profile: RecruiterProfile): Promise<void>;
}
