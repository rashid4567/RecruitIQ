import api from "@/api/axios";
import type { RecruiterRepository } from "../../Domain/repositories/RecruiterRepository";
import { RecruiterProfile } from "../../Domain/entities/recruiterEntities";

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
  async updateProfile(profile: any): Promise<any> {
    await api.put("/recruiter/profile", {
      fullName: profile.fullName,
      companyName: profile.companyName,
      companyWebsite: profile.companyWebsite,
      companySize: profile.companySize,
      industry: profile.industry,
      location: profile.location,
      bio: profile.bio,
      linkedinUrl: profile.linkedinUrl,
      designation: profile.designation,
    });

    return this.getProfile();
  }

  async completeProfile(profile: any): Promise<any> {
    await api.put("/recruiter/profile/complete", {
      companyName: profile.companyName,
      companyWebsite: profile.companyWebsite,
      companySize: profile.companySize,
      industry: profile.industry,
      location: profile.location,
      bio: profile.bio,
      linkedinUrl: profile.linkedinUrl,
      designation: profile.designation,
      subscriptionStatus: profile.subscriptionStatus,
    });

    return this.getProfile();
  }
}
