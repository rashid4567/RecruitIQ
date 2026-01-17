import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";

export class BlockRecruiterUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterRepository
  ) {}

  async execute(recruiterId: string) {
    await this.recruiterRepo.updateActiveStatus(
      recruiterId,
      false
    );
  }
}
