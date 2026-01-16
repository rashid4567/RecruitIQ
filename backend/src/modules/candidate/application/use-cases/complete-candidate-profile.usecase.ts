import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { CompleteCandidateProfileDTO } from "../dto/complete-candidate-profile.dto";

export class CompleteProfileCandidateProfileUseCase {
  constructor(
    private readonly repo: CandidateRespository
  ) {}

  async execute(
    userId: string,
    data: CompleteCandidateProfileDTO
  ) {
    return this.repo.update(userId, {
      ...data,
      profileCompleted: true,
    });
  }
}
