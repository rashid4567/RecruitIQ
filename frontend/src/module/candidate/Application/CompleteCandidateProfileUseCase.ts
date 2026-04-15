import type { CompleteCandidateProfileDTO } from "../domain/dto/CompleteCandidateProfileDTO";
import type { CandidateRepository } from "../domain/repositories/CandidateRepository";

export class CompleteCandidateProfileUseCase {
  private readonly candidateRepo: CandidateRepository;

  constructor(candidateRepo: CandidateRepository) {
    this.candidateRepo = candidateRepo;
  }

  async execute(dto: CompleteCandidateProfileDTO): Promise<void> {
    await this.candidateRepo.completeProfile(dto);
  }
}