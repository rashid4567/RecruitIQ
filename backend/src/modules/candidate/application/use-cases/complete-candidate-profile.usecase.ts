
import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { CompleteCandidateProfileDTO } from "../dto/complete-candidate-profile.dto";

export class CompleteCandidateProfileUseCase{
  constructor(
    private readonly candidateRepo : CandidateRespository
  ){};

  async execute(
    userId : string,
    data : CompleteCandidateProfileDTO
  ):Promise<void>{
    const id = UserId.create(userId);
    const profile = await this.candidateRepo.findByUserId(id);
    if(!profile){
      throw new Error("Candidate Profile not found")
    }

    profile.updateSkills(data.skills);
    profile.updateEducation(data.educationLevel);
    profile.updatePreferredLocations(data.preferredJobLocation);
    profile.updateBio(data.bio);
    profile.completeProfile();

    await this.candidateRepo.save(profile)

  }
}