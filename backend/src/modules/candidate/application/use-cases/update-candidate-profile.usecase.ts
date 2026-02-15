import { UserRepository } from "../../domain/repositories/user.repository";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UpdateCandidateProfileDTO } from "../dto/update-candidate-profile.dto";
import { CandidateProfileDTO } from "../dto/candidate-profile.dto";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { ApplicationError } from "../../../../shared/errors/applicatoin.error";
import { ERROR_CODES } from "../constants/error-code.constant";

export interface UpdateCandidateProfileResponse {
  user: {
    fullName: string;
    email: string;
    profileImage?: string;
    emailVerified: boolean;
  };
  candidateProfile: CandidateProfileDTO;
}

export class UpdateCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(
    userId: string,
    input: UpdateCandidateProfileDTO
  ): Promise<UpdateCandidateProfileResponse> {

    const id = UserId.create(userId);

    // ---------- GET USER ----------
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    // ---------- GET PROFILE ----------
    const profile = await this.candidateRepo.findByUserId(id);
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_PROFILE_NOT_FOUND);
    }

    // =====================================================
    // UPDATE USER (PATCH behavior)
    // =====================================================

    if (input.fullName !== undefined) {
      user.updateFullName(input.fullName);
    }

    if (input.profileImage !== undefined) {
      user.updateProfileImage(input.profileImage);
    }

    // =====================================================
    // UPDATE CANDIDATE PROFILE (PATCH behavior)
    // =====================================================

    if (input.currentJob !== undefined) {
      profile.updateCurrentJob(input.currentJob);
    }

    if (input.currentJobLocation !== undefined) {
      profile.updateCurrentJobLocation(input.currentJobLocation);
    }

    if (input.experienceYears !== undefined) {
      profile.updateExperienceYears(input.experienceYears);
    }

    // ⭐ prevent crash when empty array
    if (input.skills && input.skills.length > 0) {
      profile.updateSkills(input.skills);
    }

    if (input.educationLevel !== undefined) {
      profile.updateEducation(input.educationLevel);
    }

    // ⭐ prevent crash when empty array
    if (
      input.preferredJobLocations &&
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

    // =====================================================
    // RECALCULATE PROFILE COMPLETION
    // =====================================================

    try {
      profile.completeProfile();
    } catch {
      // ignore if profile not yet complete
    }

    // =====================================================
    // SAVE
    // =====================================================

    await this.userRepo.save(user);
    await this.candidateRepo.save(profile);

    // =====================================================
    // RESPONSE DTO
    // =====================================================

    return {
      user: {
        fullName: user.getFullName(),
        email: user.getEmail().getValue(),
        profileImage: user.getProfileImage(),
        emailVerified: true, // change if stored in DB
      },

      candidateProfile: {
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
      },
    };
  }
}
