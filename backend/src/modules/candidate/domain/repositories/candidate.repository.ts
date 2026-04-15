import { CandidateProfile } from "../entities/candidate-profile.entity";
import { UserId } from "../../../../shared/value-objects/userId.vo"

export interface CandidateRepository {
  findByUserId(userId: UserId): Promise<CandidateProfile | null>;
  save(profile: CandidateProfile): Promise<void>;
}
