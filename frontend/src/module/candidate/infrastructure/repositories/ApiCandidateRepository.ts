import api from "@/api/axios";
import type { CandidateRepository } from "../../domain/repositories/CandidateRepository";
import { CandidateProfile } from "../../domain/entities/candidateProfile";

export class ApiCandidateRepository implements CandidateRepository {

  async getProfile(): Promise<CandidateProfile> {
    const res = await api.get("/candidate/profile");
    return CandidateProfile.fromApi(res.data.data);
  }

  async updateProfile(profile: CandidateProfile): Promise<CandidateProfile> {
    const payload = Object.fromEntries(
      Object.entries({
        fullName: profile.fullName,
        currentJob: profile.currentJob,
        experienceYears: profile.experienceYears,
        educationLevel: profile.educationLevel,
        skills: profile.skills,
        preferredJobLocations: profile.preferredJobLocations,
        currentJobLocation: profile.currentJobLocation,
        gender: profile.gender,
        linkedinUrl: profile.linkedinUrl,
        portfolioUrl: profile.portfolioUrl,
        bio: profile.bio,
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    const res = await api.put("/candidate/profile", payload);
    const data = res.data.data;

    // Update response has different shape from getProfile:
    // - uses "profile" instead of "candidateProfile"
    // - email and id are wrapped in { value: "..." }
    return CandidateProfile.fromUpdateApi(data);
  }

  async completeProfile(profile: CandidateProfile): Promise<void> {
    const payload = Object.fromEntries(
      Object.entries({
        currentJob: profile.currentJob,
        educationLevel: profile.educationLevel,
        skills: profile.skills,
        preferredJobLocations: profile.preferredJobLocations,
        bio: profile.bio,
        experienceYears: profile.experienceYears,
        linkedinUrl: profile.linkedinUrl,
        portfolioUrl: profile.portfolioUrl,
        currentJobLocation: profile.currentJobLocation,
        gender: profile.gender,
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    await api.put("/candidate/profile/complete", payload);
  }
}