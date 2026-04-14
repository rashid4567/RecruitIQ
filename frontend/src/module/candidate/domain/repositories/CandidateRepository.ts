// domain/repositories/CandidateRepository.ts
import type { CandidateProfile } from "../entities/candidateProfile";
import type { CompleteCandidateProfileDTO } from "../dto/CompleteCandidateProfileDTO";

export interface CandidateRepository {
  getProfile(): Promise<CandidateProfile>;
  updateProfile(profile: CandidateProfile): Promise<CandidateProfile>;
  // Separate method that hits the /complete endpoint
  completeProfile(dto: CompleteCandidateProfileDTO): Promise<void>;
}