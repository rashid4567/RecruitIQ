import { UserRepository } from "../../domain/repositories/user.repository";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UpdateCandidateProfileDTO } from "../dto/update-candidate-profile.dto";
import { CandidateProfileDTO } from "../dto/candidate-profile.dto";
import { UserId } from "../../domain/value-objects/user-id.vo";

export class UpdateCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(
    userId: string,
    input: UpdateCandidateProfileDTO,
  ): Promise<CandidateProfileDTO> {
    const id = UserId.create(userId);

    const user = await this.userRepo.findById(id);
    if(!user){
      throw new Error("User not found")
    }
    const profile = await this.candidateRepo.findByUserId(id);

    if(!profile){
      throw new Error("Candidate profile not found")
    }

    if(input.fullName){
      user.updateFullName(input.fullName)
    }

    if(input.profileImage){
      user.updateProfileImage(input.profileImage)
    }
    
    if(input.skills){
      profile.updateSkills(input.skills)
    }
    if(input.educationLevel){
      profile.updateEducation(input.educationLevel)
    }
    if(input.preferredJobLocation){
      profile.updatePreferredLocations(input.preferredJobLocation)
    }
    if(input.bio){
      profile.updateBio(input.bio)
    }
    
    await this.userRepo.save(user);
    await this.candidateRepo.save(profile);
    return {
      currentJob : profile.getCurrentJob(),
      experienceYears : profile.getExperienceYears(),
      skills : profile.getSkills(),
      educationLevel : profile.getEducationLevel() ?? "",
      preferredJobLocation : profile.getPreferredLocations(),
      bio : profile.getBio() ?? "",
      profileCompleted : profile.isProfileCompleted() 
      
    }
  }
}
