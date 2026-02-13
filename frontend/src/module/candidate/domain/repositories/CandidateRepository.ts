import type { CandidateProfile } from "../entities/candidateProfile";

export interface CandidateRepository {
  getProfile(): Promise<CandidateProfile>;

  updateProfile(profile: CandidateProfile): Promise<CandidateProfile>;
  completeProfile(profile: CandidateProfile): Promise<void>;
}
