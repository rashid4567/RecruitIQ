
import type { RecruiterProfile } from "../../Domain/entities/recruiterEntities";
import type { RecruiterRepository } from "../../Domain/repositories/RecruiterRepository";

export class UpdateRecruiterProfileUseCase {   
  private readonly recruiterRepo: RecruiterRepository;

  constructor(recruiterRepo: RecruiterRepository) {
    this.recruiterRepo = recruiterRepo;
  }

  async execute(profile: RecruiterProfile): Promise<RecruiterProfile> {
    return this.recruiterRepo.updateProfile(profile);
  }
}