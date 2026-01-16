import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UserRepository } from "../../domain/repositories/user.repository";
import { GetCandidateProfileResponseDTO } from "../dto/candidate-profile.dto";

export class GetCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository
  ) {}

  async execute(userId: string): Promise<GetCandidateProfileResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const candidateProfile = await this.candidateRepo.findByUserId(userId);
    if (!candidateProfile) {
      throw new Error("Candidate profile not found");
    }

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
      },
      candidateProfile: {
        currentJob: candidateProfile.currentJob,
        experienceYears: candidateProfile.experienceYears,
        skills: candidateProfile.skills,
        educationLevel: candidateProfile.educationLevel ?? "",
        preferredJobLocation: candidateProfile.preferredJobLocation,
        bio: candidateProfile.bio ?? "",
        profileCompleted: candidateProfile.profileCompleted,
      },
    };
  }
}
