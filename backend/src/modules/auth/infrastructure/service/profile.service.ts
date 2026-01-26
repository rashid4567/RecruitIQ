import { candidateProfileModel } from "../../../candidate/infrastructure/monogoose/models/candidate-profile.model";
import { RecruiterProfileModel } from "../../../recruiter/infrastructure/mongoose/model/recruiter-profile.model";
import { ProfileCreatorPort } from "../../application/ports/profile-creator.port";
import { SUBSCRIPTION_STATUS, VERIFICATION_STATUS } from "../constants/profileService.constant";

export class ProfileService implements ProfileCreatorPort {
  async createCandidateProfile(userId: string): Promise<void> {
    await candidateProfileModel.create({ userId });
  }


  async createRecruiterProfile(userId: string): Promise<void> {
    await RecruiterProfileModel.create(
      {
        userId,
        verificationStatus : VERIFICATION_STATUS.PENDING,
        subscriptionStatus : SUBSCRIPTION_STATUS.FREE,
      }
    )
  }
}
