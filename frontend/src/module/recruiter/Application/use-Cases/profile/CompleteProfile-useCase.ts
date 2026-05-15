import type { RecruiterRepository } from "../../Domain/repositories/RecruiterRepository";
import type { CompleteRecruiterProfileDTO } from "../../Domain/dto/completeProfile.dto";

export class CompleteRecruiterProfileUseCase {
  private readonly repo: RecruiterRepository;
  constructor(repo: RecruiterRepository) {
    this.repo = repo;
  }

  async execute(data: CompleteRecruiterProfileDTO): Promise<void> {
    await this.repo.completeProfile(data);
  }
}
