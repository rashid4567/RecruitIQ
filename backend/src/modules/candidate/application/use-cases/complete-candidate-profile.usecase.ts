
import { CandidateRepository } from "../../domain/repositories/candidate.repository";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { ERROR_CODES } from "../constants/error-code.constant";
import { CompleteCandidateProfileDTO } from "../dto/complete-candidate-profile.dto";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { CandidateProfile } from "../../domain/entities/candidate-profile.entity";

export class CompleteCandidateProfileUseCase {
  constructor(private readonly candidateRepo: CandidateRepository) {}

  async execute(
    userId: string,
    data: CompleteCandidateProfileDTO,
  ): Promise<void> {
    const id = UserId.create(userId);
    let profile = await this.candidateRepo.findByUserId(id);
    if (!profile) {
      profile = CandidateProfile.create(id);
    }


    profile.updateSkills(data.skills);
    profile.updateEducation(data.educationLevel);
    profile.updatePreferredLocations(data.preferredJobLocations);
    profile.updateBio(data.bio);

    if (data.currentJobLocation !== undefined)
      profile.updateCurrentJobLocation(data.currentJobLocation);

    if (data.gender !== undefined)
      profile.updateGender(data.gender);

    if (data.linkedinUrl !== undefined)
      profile.updateLinkedinUrl(data.linkedinUrl);

    if (data.portfolioUrl !== undefined)
      profile.updatePortfolioUrl(data.portfolioUrl);

    profile.completeProfile();

    await this.candidateRepo.save(profile);
  }
}