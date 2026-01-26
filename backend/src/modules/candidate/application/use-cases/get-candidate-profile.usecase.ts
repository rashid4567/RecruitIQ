import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { GetCandidateProfileResponseDTO } from "../dto/candidate-profile.dto";

export class GetCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository
  ) {}

  async execute(userId:string):Promise<GetCandidateProfileResponseDTO>{
    const id = UserId.create(userId);

    const user = await this.userRepo.findById(id);
    if(!user){
      throw new Error("User not found")
    }

    const profile = await this.candidateRepo.findByUserId(id);
    if(!profile){
      throw new Error("Candidate profile not found")
    }

    return {
      user : {
        id : user.getId().getValue(),
        fullName : user.getFullName(),
        email : user.getEmail().getValue(),
        profileImage : user.getProfileImage(),
      },
      candidateProfile : {
        currentJob : profile.getCurrentJob(),
        experienceYears : profile.getExperienceYears(),
        skills : profile.getSkills(),
        preferredJobLocation : profile.getPreferredLocations(),
        educationLevel : profile.getEducationLevel() ?? "",
        bio : profile.getBio() ?? "",
        profileCompleted : profile.isProfileCompleted()

      }
    }

  }
}
