import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { ERROR_CODES } from "../constants/error-code.constant";
import { GetCandidateProfileResponseDTO } from "../dto/candidate-profile.dto";
import { ApplicationError } from "../../../../shared/errors/applicatoin.error";

export class GetCandidateProfileUseCase {
  constructor(
    private readonly candidateRepo: CandidateRespository,
    private readonly userRepo: UserRepository
  ) {}

  async execute(userId:string):Promise<GetCandidateProfileResponseDTO>{
    const id = UserId.create(userId);

    const user = await this.userRepo.findById(id);
    if(!user){
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
    }

    const profile = await this.candidateRepo.findByUserId(id);
    if(!profile){
      throw new ApplicationError(ERROR_CODES.CANDIDATE_PROFILE_NOT_FOUND)
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
        preferredJobLocations : profile.getPreferredLocations(),
        educationLevel : profile.getEducationLevel() ?? "",
        bio : profile.getBio() ?? "",
        currentJobLocation : profile.getCurrentJobLocation() ?? "",
        gender : profile.getCurrentJob() ?? "",
        linkedinUrl : profile.getLinkedinUrl() ?? "",
        portfolioUrl : profile.getPortfolioUrl() ?? "",
        profileCompleted : profile.isProfileCompleted(),

      }
    }

  }
}
