import { UserRepository } from "../../../domain/repositories/user.repository";
import { CandidateRepository } from "../../../domain/repositories/candidate.repository";
import { UpdateCandidateProfileDTO } from "../../dto/update-candidate-profile.dto";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../constants/error-code.constant";
import { User } from "../../../domain/entities/user.entity";
import { CandidateProfile } from "../../../domain/entities/candidate-profile.entity";

export interface UpdateCandidateProfileResult {
  user: User;
  profile: CandidateProfile;
}

export class UpdateCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(
    userIdRaw: string,
    input: UpdateCandidateProfileDTO,
  ): Promise<UpdateCandidateProfileResult> {
    const userId = UserId.create(userIdRaw);

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    const profile = await this.candidateRepo.findByUserId(userId);
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_PROFILE_NOT_FOUND);
    }

    if (input.fullName !== undefined) {
      user.updateFullName(input.fullName);
    }

    if (input.profileImage !== undefined) {
      user.updateProfileImage(input.profileImage);
    }

    if (input.currentJob !== undefined) {
      profile.updateCurrentJob(input.currentJob);
    }

    if (input.currentJobLocation !== undefined) {
      profile.updateCurrentJobLocation(input.currentJobLocation);
    }

    if (input.experienceYears !== undefined) {
      profile.updateExperienceYears(input.experienceYears);
    }

    if (input.skills !== undefined && input.skills.length > 0) {
      profile.updateSkills(input.skills);
    }

    if (input.educationLevel !== undefined) {
      profile.updateEducation(input.educationLevel);
    }

    if (
      input.preferredJobLocations !== undefined &&
      input.preferredJobLocations.length > 0
    ) {
      profile.updatePreferredLocations(input.preferredJobLocations);
    }

    if (input.bio !== undefined) {
      profile.updateBio(input.bio);
    }

    if (input.gender !== undefined) {
      profile.updateGender(input.gender);
    }

    if (input.linkedinUrl !== undefined) {
      profile.updateLinkedinUrl(input.linkedinUrl);
    }

    if (input.portfolioUrl !== undefined) {
      profile.updatePortfolioUrl(input.portfolioUrl);
    }

    if (!profile.isProfileCompleted() && profile.canBeCompleted()) {
      profile.completeProfile();
    }

    await this.userRepo.save(user);
    await this.candidateRepo.save(profile);

    return {
      user,
      profile,
    };
  }
}
