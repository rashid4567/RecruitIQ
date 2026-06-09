import { CandidateRepository } from "../../../domain/repositories/candidate.repository";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../constants/error-code.constant";
import { GetCandidateProfileResponseDTO } from "../../dto/candidate-profile.dto";
import { FileStorageRepository } from "../../../../resume/domain/repository/fileStorage.repository";

export class GetCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRepository,
    private readonly userRepo: UserRepository,
    private readonly resumeRepo: ResumeRepository,
     private readonly fileStorageRepo: FileStorageRepository,
  ) {}

  async execute(userId: string): Promise<GetCandidateProfileResponseDTO> {
    const id = UserId.create(userId);
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    let profileImageUrl : string | undefined;
    const profileImageKey = user.getProfileImage();

    if(profileImageKey){
      profileImageUrl = await this.fileStorageRepo.getViewUrl(profileImageKey)
    }
    const profile = await this.candidateRepo.findByUserId(id);
    const resume = await this.resumeRepo.findByCandidateId(
      id.getValue(),
    );

    return {
      user: {
        id: user.getId().getValue(),
        fullName: user.getFullName(),
        email: user.getEmail().getValue(),
        profileImage: profileImageUrl,
      },

      candidateProfile: {
        currentJob: profile?.getCurrentJob() ?? "",
        experienceYears: profile?.getExperienceYears() ?? 0,
        skills: profile?.getSkills() ?? [],
        educationLevel: profile?.getEducationLevel() ?? "",
        preferredJobLocations: profile?.getPreferredLocations() ?? [],
        bio: profile?.getBio() ?? "",
        currentJobLocation: profile?.getCurrentJobLocation() ?? "",
        gender: profile?.getGender(),
        linkedinUrl: profile?.getLinkedinUrl() ?? "",
        portfolioUrl: profile?.getPortfolioUrl() ?? "",
        profileCompleted: profile?.isProfileCompleted() ?? false,

        resume: resume
          ? {
              id: resume.getId(),
              candidateId: resume.getCandidateId(),
              fileName: resume.getFileName(),
              fileKey: resume.getFileKey(),
              uploadedAt: resume.getUploadedAt(),
              parsedData: resume.getParsedData(),
            }
          : null,
      },
    };
  }
}