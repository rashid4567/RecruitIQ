import { CandidateProfile } from "../entities/candidate-profile.entity";
import { UserId } from "../value-objects/user-id.vo";

export interface CandidateRespository {
  findByUserId(userId: UserId): Promise<CandidateProfile | null>;
  save(profile: CandidateProfile): Promise<void>;
}
