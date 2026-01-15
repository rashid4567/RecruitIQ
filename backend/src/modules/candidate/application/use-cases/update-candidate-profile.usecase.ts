import { UserRepository } from "../../domain/repositories/user.repository";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";

export class UpdateCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository
  ) {}

  async execute(
    userId: string,
    input: {
      fullName?: string;
      email?: string;
      profileImage?: string;
      currentJob?: string;
      experienceYears?: number;
      skills?: string[];
      educationLevel?: string;
      preferredJobLocation?: string[];
      bio?: string;
    }
  ) {
    const {
      fullName,
      email,
      profileImage,
      ...candidateData
    } = input;


    if (fullName || email || profileImage) {
      await this.userRepo.updateProfile(userId, {
        fullName,
        email,
        profileImage,
      });
    }

 
    return this.candidateRepo.update(userId, candidateData);
  }
}
