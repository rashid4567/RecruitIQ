import { UserRepository } from "../../domain/repositories/user.repository";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UpdateCandidateProfileDTO } from "../dto/update-candidate-profile.dto";
import { CandidateProfileDTO } from "../dto/candidate-profile.dto";

export class UpdateCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository
  ) {}

  async execute(
    userId: string,
    input: UpdateCandidateProfileDTO
  ): Promise<CandidateProfileDTO> {
    const { fullName, profileImage, ...candidateData } = input;

    if (fullName || profileImage) {
      await this.userRepo.updateProfile(userId, {
        fullName,
        profileImage,
      });
    }

    const updated = await this.candidateRepo.update(userId, candidateData);

    return {
      currentJob: updated.currentJob,
      experienceYears: updated.experienceYears,
      skills: updated.skills,
      educationLevel: updated.educationLevel ?? "",
      preferredJobLocation: updated.preferredJobLocation,
      bio: updated.bio ?? "",
      profileCompleted: updated.profileCompleted,
    };
  }
}
