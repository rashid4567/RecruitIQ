import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";

export class VerifyRecruiterUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterRepository
  ) {}

  async execute(
    recruiterId: string,
    status: "pending" | "verified" | "rejected"
  ) {
    return this.recruiterRepo.verifyRecruiter(
      recruiterId,
      status
    );
  }
}
