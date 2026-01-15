import { candidateProfileModel } from "../../../candidate/candidateProfile.model";
import { RecruiterProfileModel } from "../../../recruiter/recruiterProfile.model";


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
