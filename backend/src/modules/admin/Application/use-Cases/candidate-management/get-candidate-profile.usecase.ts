import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { FileStorageRepository } from "../../../../resume/domain/repository/fileStorage.repository";
import { CandidateRepository } from "../../../Domain/repositories/candidate.repository";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import {
  CandidateProfileRequestDTO,
  CandidateProfileResponseDTO,
} from "../../dto/candidate.dto/candidate-profile-response.dto";

export class GetCandidateprofileUseCase implements UseCase<
  CandidateProfileRequestDTO,
  CandidateProfileResponseDTO
> {
  constructor(
    private readonly candidateRepo: CandidateRepository,
    private readonly fileStorageRepo: FileStorageRepository,
  ) {}

  async execute(
    request: CandidateProfileRequestDTO,
  ): Promise<CandidateProfileResponseDTO> {
    const profile = await this.candidateRepo.findById(
      request.candidateId,
    );

    if (!profile) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }

    const profileImageKey = profile.getProfileImage();

    let profileImageUrl: string | undefined;

    if (profileImageKey) {
      profileImageUrl = await this.fileStorageRepo.getViewUrl(profileImageKey);
    }

    return {
      id: profile.getId().getValue(),
      name: profile.getName(),
      email: profile.getEmail().getValue(),
      isActive: profile.isActiveAccount(),
      profileImage: profileImageUrl,
      currentJob: profile.getCurrentJob(),
      experienceYears: profile.getExperienceYears(),
      educationLevel: profile.getEducationLevel(),
      skills: profile.getSkills(),
      preferredJobLocations: profile.getPreferredJobLocations(),
      bio: profile.getBio(),
      currentJobLocation: profile.getCurrentJobLocation(),
      gender: profile.getGender(),
      linkedinUrl: profile.getLinkedinUrl(),
      portfolioUrl: profile.getPortfolioUrl(),
      profileCompleted: profile.isProfileCompleted(),
    };
  }
}
