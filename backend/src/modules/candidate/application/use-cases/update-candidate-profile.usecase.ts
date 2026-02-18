import { UserRepository } from "../../domain/repositories/user.repository";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UpdateCandidateProfileDTO } from "../dto/update-candidate-profile.dto";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { ApplicationError } from "../../../../shared/errors/applicatoin.error";
import { ERROR_CODES } from "../constants/error-code.constant";
import { User } from "../../domain/entities/user.entity";
import { CandidateProfile } from "../../domain/entities/candidate-profile.entity";


// ✅ Clean return type (domain objects only)
export interface UpdateCandidateProfileResult {
  user: User;
  profile: CandidateProfile;
}

export class UpdateCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(
    userIdRaw: string,
    input: UpdateCandidateProfileDTO,
  ): Promise<UpdateCandidateProfileResult> {
    
    // ===== CREATE VALUE OBJECT =====
    const userId = UserId.create(userIdRaw);

    // ===== FETCH USER =====
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    // ===== FETCH PROFILE =====
    const profile = await this.candidateRepo.findByUserId(userId);
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_PROFILE_NOT_FOUND);
    }

    // ================================
    // USER UPDATES
    // ================================
    if (input.fullName !== undefined) {
      user.updateFullName(input.fullName);
    }

    if (input.profileImage !== undefined) {
      user.updateProfileImage(input.profileImage);
    }

    // ================================
    // PROFILE UPDATES
    // ================================

    if (input.currentJob !== undefined) {
      profile.updateCurrentJob(input.currentJob);
    }

    if (input.currentJobLocation !== undefined) {
      profile.updateCurrentJobLocation(input.currentJobLocation);
    }

    if (input.experienceYears !== undefined) {
      profile.updateExperienceYears(input.experienceYears);
    }

    // Important: allow empty array validation in domain
    if (input.skills !== undefined) {
      profile.updateSkills(input.skills);
    }

    if (input.educationLevel !== undefined) {
      profile.updateEducation(input.educationLevel);
    }

    if (input.preferredJobLocations !== undefined) {
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

    // ================================
    // PROFILE COMPLETION CHECK
    // ================================
    // Do NOT silently catch errors
    // Let domain decide completion rules
    if (profile.canBeCompleted()) {
      profile.completeProfile();
    }

    // ================================
    // SAVE CHANGES
    // ================================
    await this.userRepo.save(user);
    await this.candidateRepo.save(profile);

    // Return domain objects (controller maps response)
    return {
      user,
      profile,
    };
  }
}
