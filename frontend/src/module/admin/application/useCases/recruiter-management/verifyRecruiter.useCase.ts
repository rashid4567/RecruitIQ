import type { RecruiterRepository } from "../../domain/repositories/recruiter.repository";

export class VerifyRecruiterUseCase {
    private readonly recruiterRepo: RecruiterRepository 
  constructor( recruiterRepo: RecruiterRepository ) {
    this.recruiterRepo = recruiterRepo
  }

  async execute(recruiterId: string): Promise<void> {
    await this.recruiterRepo.updateVerificationStatus(
      recruiterId,
      "verified"
    );
  }
}
