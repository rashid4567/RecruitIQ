import api from "@/api/axios";
import type { CandidateRepository } from "../../domain/repositories/CandidateRepository";
import { CandidateProfile } from "../../domain/entities/candidateProfile";

export class ApiCandidateRepository implements CandidateRepository {

  async getProfile(): Promise<CandidateProfile> {
    const res = await api.get("/candidate/profile");
    const data = res.data.data;

    return new CandidateProfile({
      fullName: data.user.fullName,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      profileImage: data.user.profileImage,

      currentJob: data.candidateProfile.currentJob,
      experienceYears: data.candidateProfile.experienceYears,
      educationLevel: data.candidateProfile.educationLevel,
      skills: data.candidateProfile.skills,
      preferredJobLocations: data.candidateProfile.preferredJobLocations,
      currentJobLocation: data.candidateProfile.currentJobLocation,
      gender: data.candidateProfile.gender,
      linkedinUrl: data.candidateProfile.linkedinUrl,
      portfolioUrl: data.candidateProfile.portfolioUrl,
      bio: data.candidateProfile.bio,

      profileCompleted: data.candidateProfile.profileCompleted,
    });
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
      }).filter(([_, value]) => value !== undefined)
    );

    const res = await api.put("/candidate/profile", payload);
    const data = res.data.data;

    return new CandidateProfile({
      fullName: data.user.fullName,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      profileImage: data.user.profileImage,

      currentJob: data.candidateProfile.currentJob,
      experienceYears: data.candidateProfile.experienceYears,
      educationLevel: data.candidateProfile.educationLevel,
      skills: data.candidateProfile.skills,
      preferredJobLocations: data.candidateProfile.preferredJobLocations,
      currentJobLocation: data.candidateProfile.currentJobLocation,
      gender: data.candidateProfile.gender,
      linkedinUrl: data.candidateProfile.linkedinUrl,
      portfolioUrl: data.candidateProfile.portfolioUrl,
      bio: data.candidateProfile.bio,

      profileCompleted: data.candidateProfile.profileCompleted,
    });
  }

  async completeProfile(profile: CandidateProfile): Promise<void> {
   
    const payload = {
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
    };

    await api.put("/candidate/profile/complete", payload);
  }
}
