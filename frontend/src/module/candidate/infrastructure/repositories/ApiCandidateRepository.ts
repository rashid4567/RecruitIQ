import api from "@/api/axios";
import type { CandidateRepository } from "../../domain/repositories/CandidateRepository";
import type { CompleteCandidateProfileDTO } from "../../domain/dto/CompleteCandidateProfileDTO";
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
      }).filter(([, value]) => value !== undefined && value !== null),
    );
    const res = await api.put("/candidate/profile", payload);
    return CandidateProfile.fromUpdateApi(res.data.data);
  }

  async completeProfile(dto: CompleteCandidateProfileDTO): Promise<void> {
    const payload: Record<string, unknown> = {
      skills: dto.skills ?? [],
      preferredJobLocations: dto.preferredJobLocations ?? [],
    };
    if (dto.currentJob) {
      payload.currentJob = dto.currentJob;
    }
    if (dto.educationLevel) {
      payload.educationLevel = dto.educationLevel;
    }
    if (dto.bio) {
      payload.bio = dto.bio;
    }
    if (dto.experienceYears !== undefined) {
      payload.experienceYears = dto.experienceYears;
    }
    if (dto.linkedinUrl) {
      payload.linkedinUrl = dto.linkedinUrl;
    }
    if (dto.portfolioUrl) {
      payload.portfolioUrl = dto.portfolioUrl;
    }
    if (dto.currentJobLocation) {
      payload.currentJobLocation = dto.currentJobLocation;
    }
    if (dto.gender) {
      payload.gender = dto.gender;
    }
    await api.put("/candidate/profile/complete", payload);
  }
}
