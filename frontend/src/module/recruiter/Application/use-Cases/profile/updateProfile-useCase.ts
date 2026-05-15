
import type { RecruiterProfile } from "../../Domain/entities/recruiterEntities";
import type { RecruiterRepository } from "../../Domain/repositories/RecruiterRepository";
import type { UpdateRecruiterProfileDTO } from "../types/updateProfileTypes";

export class UpdateRecruiterProfileUseCase {   
  private readonly recruiterRepo: RecruiterRepository;

  constructor(recruiterRepo: RecruiterRepository) {
    this.recruiterRepo = recruiterRepo;
  }

  async execute(profile: UpdateRecruiterProfileDTO): Promise<RecruiterProfile> {
    return this.recruiterRepo.updateProfile(profile);
  }
}