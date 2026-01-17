import { candidateProfileModel } from "../../../candidate/infrastructure/monogoose/models/candidate-profile.model";
import { RecruiterProfileModel } from "../../../recruiter/infrastructure/mongoose/model/recruiter-profile.model"; 


export class ProfileService {
  async createProfile(userId: string, role: string) {
    if (role === "candidate") {
      await candidateProfileModel.create({ userId });
    }
    if (role === "recruiter") {
      await RecruiterProfileModel.create({
        userId,
        verificationStatus: "pending",
        subscriptionStatus: "free",
      });
    }
  }
}
