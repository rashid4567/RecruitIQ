import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";

export class UnblockRecruiterUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterRepository
  ) {}

  async execute(recruiterId: string) {
    await this.recruiterRepo.updateActiveStatus(
      recruiterId,
      true
    );
  }
}
