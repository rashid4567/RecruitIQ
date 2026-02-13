import { CandidateProfile } from "../entities/candidate-profile.entity";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo"

export interface CandidateRespository {
  findByUserId(userId: UserId): Promise<CandidateProfile | null>;
  save(profile: CandidateProfile): Promise<void>;
}
