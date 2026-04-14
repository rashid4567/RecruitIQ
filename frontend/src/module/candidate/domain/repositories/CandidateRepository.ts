import type { CandidateProfile } from "../entities/candidateProfile";
import type { CompleteCandidateProfileDTO } from "../dto/CompleteCandidateProfileDTO";

export interface CandidateRepository {
  getProfile(): Promise<CandidateProfile>;
  updateProfile(profile: CandidateProfile): Promise<CandidateProfile>;
  completeProfile(dto: CompleteCandidateProfileDTO): Promise<void>;
}
