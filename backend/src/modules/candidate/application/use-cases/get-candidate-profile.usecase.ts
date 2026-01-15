import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UserRepository } from "../../domain/repositories/user.repository";

export class GetCandidateProfileUseCase{
    constructor(
        private readonly candidateRepo : CandidateRespository,
        private readonly userRepo : UserRepository
    ){};
    
   async execute(userId: string) {
  const user = await this.userRepo.findById(userId);
  const candidateProfile = await this.candidateRepo.findByUserId(userId);

  if (!user || !candidateProfile) {
    throw new Error("Profile not found");
  }

  return {
    user: {
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
    },
    candidateProfile,
  };
}

}