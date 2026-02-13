import { CandidateRepository } from "../../../Domain/repositories/candidate.repository";
import { CandidateProfileResponseDTO } from "../../dto/candidate.dto/candidate-profile-response.dto";


export class GetCandidateprofileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRepository
  ) {}

  async execute(candidateId: string): Promise<CandidateProfileResponseDTO> {
    const profile = await this.candidateRepo.findProfileById(candidateId);

    if (!profile) {
      throw new Error("Candidate profile is not found");
    }

    return {
      id: profile.getId().getValue(),                
      name: profile.getName(),
      email: profile.getEmail().getValue(),          
      isActive: profile.isActiveAccount(),
      currentJob: profile.getCurrentJob(),
      experienceYears: profile.getExperienceYears(),
      educationLevel: profile.getEducationLevel(),
      skills: profile.getSkills(),
      preferredJobLocations: profile.getPreferredJobLocations(),
      bio: profile.getBio(),
      currentJobLocation: profile.getCurrentJobLocation(),
      gender: profile.getGender(),
      linkedinUrl: profile.getLinkedinUrl(),
      portfolioUrl: profile.getPortfolioUrl(),
      profileCompleted: profile.isProfileCompleted(),
    };
  }
}