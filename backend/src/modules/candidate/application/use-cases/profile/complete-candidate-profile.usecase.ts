import { CandidateRepository } from "../../../domain/repositories/candidate.repository";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { CompleteCandidateProfileDTO, CompleteCandidateProfileRequestDTO } from "../../dto/complete-candidate-profile.dto";
import { CandidateProfile } from "../../../domain/entities/candidate-profile.entity";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";

export class CompleteCandidateProfileUseCase implements UseCase<CompleteCandidateProfileRequestDTO,void> {
  constructor(private readonly candidateRepo: CandidateRepository) {}

  async execute(
   Request : CompleteCandidateProfileRequestDTO
  ): Promise<void> {
    const id = UserId.create(Request.userId);
    let profile = await this.candidateRepo.findByUserId(id);
    if (!profile) {
      profile = CandidateProfile.create(id);
    }

    const data = Request.profile

    profile.updateSkills(data.skills);
    profile.updateEducation(data.educationLevel);
    profile.updatePreferredLocations(data.preferredJobLocations);
    profile.updateBio(data.bio);

    if (data.currentJobLocation !== undefined)
      profile.updateCurrentJobLocation(data.currentJobLocation);

    if (data.gender !== undefined) profile.updateGender(data.gender);

    if (data.linkedinUrl !== undefined)
      profile.updateLinkedinUrl(data.linkedinUrl);

    if (data.portfolioUrl !== undefined)
      profile.updatePortfolioUrl(data.portfolioUrl);

    profile.completeProfile();

    await this.candidateRepo.save(profile);
  }
}
