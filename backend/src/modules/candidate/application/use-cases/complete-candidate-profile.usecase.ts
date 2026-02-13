import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";
import { ERROR_CODES } from "../constants/error-code.constant";
import { CompleteCandidateProfileDTO } from "../dto/complete-candidate-profile.dto";
import { ApplicationError } from "../../../../shared/errors/applicatoin.error";

export class CompleteCandidateProfileUseCase {
  constructor(private readonly candidateRepo: CandidateRespository) {}

  async execute(
    userId: string,
    data: CompleteCandidateProfileDTO,
  ): Promise<void> {
    const id = UserId.create(userId);
    const profile = await this.candidateRepo.findByUserId(id);
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_PROFILE_NOT_FOUND);
    }

    profile.updateSkills(data.skills);
    profile.updateEducation(data.educationLevel);
    profile.updatePreferredLocations(data.preferredJobLocations);
    profile.updateBio(data.bio);

    if (data.currentJobLocation)
      profile.updateCurrentJobLocation(data.currentJobLocation);

    if (data.gender) profile.updateGender(data.gender);

    if (data.linkedinUrl) profile.updateLinkedinUrl(data.linkedinUrl);

    if (data.portfolioUrl) profile.updatePortfolioUrl(data.portfolioUrl);

    profile.completeProfile();
    await this.candidateRepo.save(profile);
  }
}
