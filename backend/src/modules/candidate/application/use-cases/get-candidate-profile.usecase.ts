import { CandidateRepository } from "../../domain/repositories/candidate.repository";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { ERROR_CODES } from "../constants/error-code.constant";
import { GetCandidateProfileResponseDTO } from "../dto/candidate-profile.dto";
import { ApplicationError } from "../../../../shared/errors/application.error";

export class GetCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string): Promise<GetCandidateProfileResponseDTO> {
    const id = UserId.create(userId);

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    const profile = await this.candidateRepo.findByUserId(id);

    return {
      user: {
        id: user.getId().getValue(),
        fullName: user.getFullName(),
        email: user.getEmail().getValue(),
        profileImage: user.getProfileImage(),
      },
      candidateProfile: {
        currentJob: profile?.getCurrentJob() ?? "",
        experienceYears: profile?.getExperienceYears() ?? 0,
        skills: profile?.getSkills() ?? [],
        preferredJobLocations: profile?.getPreferredLocations() ?? [],
        educationLevel: profile?.getEducationLevel() ?? "",
        bio: profile?.getBio() ?? "",
        currentJobLocation: profile?.getCurrentJobLocation() ?? "",
        gender: profile?.getGender() ?? undefined,
        linkedinUrl: profile?.getLinkedinUrl() ?? "",
        portfolioUrl: profile?.getPortfolioUrl() ?? "",
        profileCompleted: profile?.isProfileCompleted() || false,
      },
    };
  }
}
