import api from "@/api/axios";
import type { RecruiterRepository } from "../../Domain/repositories/RecruiterRepository";
import { RecruiterProfile } from "../../Domain/entities/recruiterEntities";

import type { CompleteRecruiterProfileDTO } from "../../Domain/dto/completeProfile.dto";
import type { UpdateRecruiterProfileDTO } from "../../Domain/dto/updateRecruiterProfile.dto";

export class ApiRecruiterRepository implements RecruiterRepository {
  async getProfile(): Promise<RecruiterProfile> {
    const res = await api.get("/recruiter/profile");
    const { user, recruiter } = res.data.data;

    return new RecruiterProfile({
      fullName: user.fullName,
      email: user.email,

      companyName: recruiter.companyName,
      companyWebsite: recruiter.companyWebsite,
      companySize: recruiter.companySize,
      industry: recruiter.industry,
      location: recruiter.location,
      bio: recruiter.bio,
      designation: recruiter.designation,
      linkedinUrl: recruiter.linkedinUrl,

      subscriptionStatus: recruiter.subscriptionStatus,
      verificationStatus: recruiter.verificationStatus,
      jobPostsUsed: recruiter.jobPostsUsed,
    });
  }

  async updateProfile(
    data: UpdateRecruiterProfileDTO,
  ): Promise<RecruiterProfile> {
    await api.put("/recruiter/profile", data);
    return this.getProfile();
  }

  async completeProfile(
    data: CompleteRecruiterProfileDTO,
  ): Promise<RecruiterProfile> {
    await api.put("/recruiter/complete-profile", data);
    return this.getProfile();
  }
}
