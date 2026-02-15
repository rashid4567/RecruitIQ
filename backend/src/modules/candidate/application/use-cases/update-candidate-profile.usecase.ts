import { UserRepository } from "../../domain/repositories/user.repository";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UpdateCandidateProfileDTO } from "../dto/update-candidate-profile.dto";
import { CandidateProfileDTO } from "../dto/candidate-profile.dto";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { ApplicationError } from "../../../../shared/errors/applicatoin.error";
import { ERROR_CODES } from "../constants/error-code.constant";

export class UpdateCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(
  userId: string,
  input: UpdateCandidateProfileDTO
): Promise<CandidateProfileDTO> {
  const id = UserId.create(userId);

  const user = await this.userRepo.findById(id);
  if (!user) {
    throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
  }

  const profile = await this.candidateRepo.findByUserId(id);
  if (!profile) {
    throw new ApplicationError(ERROR_CODES.CANDIDATE_PROFILE_NOT_FOUND);
  }

  if (input.fullName) user.updateFullName(input.fullName);
  if (input.profileImage) user.updateProfileImage(input.profileImage);

  if (input.currentJob) profile.updateCurrentJob(input.currentJob);
  if (input.currentJobLocation) profile.updateCurrentJobLocation(input.currentJobLocation);
  if (input.experienceYears !== undefined) {
  profile.updateExperienceYears(input.experienceYears);
}

  if (input.skills) profile.updateSkills(input.skills);
  if (input.educationLevel) profile.updateEducation(input.educationLevel);
  if (input.preferredJobLocations) {
    profile.updatePreferredLocations(input.preferredJobLocations);
  }
  if (input.bio) profile.updateBio(input.bio);
  if (input.gender) profile.updateGender(input.gender);
  if (input.linkedinUrl) profile.updateLinkedinUrl(input.linkedinUrl);
  if (input.portfolioUrl) profile.updatePortfolioUrl(input.portfolioUrl);

  await this.userRepo.save(user);
  await this.candidateRepo.save(profile);

  return {
    currentJob: profile.getCurrentJob(),
    experienceYears: profile.getExperienceYears(),
    skills: profile.getSkills(),
    educationLevel: profile.getEducationLevel() ?? "",
    preferredJobLocations: profile.getPreferredLocations(),
    bio: profile.getBio() ?? "",
    currentJobLocation: profile.getCurrentJobLocation() ?? "",
    gender: profile.getGender() ?? "",
    linkedinUrl: profile.getLinkedinUrl() ?? "",
    portfolioUrl: profile.getPortfolioUrl() ?? "",
    profileCompleted: profile.isProfileCompleted(),
  };
}

}
