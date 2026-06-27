import api from "@/api/axios";

import type {
  CandidateProfile,
  CandidateProfileApiResponse,
  CompleteCandidateProfilePayload,
  UpdateCandidateProfilePayload,
} from "../types/candidate.types";

export const getCandidateProfile = async (): Promise<CandidateProfile> => {
  const { data } = await api.get<{
  data: CandidateProfileApiResponse;
}>("/candidate/profile");

const response = data.data;

const profile: CandidateProfile = {
  fullName: response.user.fullName,
  email: response.user.email,
  emailVerified: response.user.emailVerified ?? false,
  profileImage: response.user.profileImage,
  currentJob: response.candidateProfile.currentJob,
  experienceYears: response.candidateProfile.experienceYears,
  educationLevel: response.candidateProfile.educationLevel,
  skills: response.candidateProfile.skills ?? [],
  preferredJobLocations:
    response.candidateProfile.preferredJobLocations ?? [],
  currentJobLocation:
    response.candidateProfile.currentJobLocation,
  gender: response.candidateProfile.gender,
  linkedinUrl: response.candidateProfile.linkedinUrl,
  portfolioUrl: response.candidateProfile.portfolioUrl,
  bio: response.candidateProfile.bio,
  profileCompleted:
    response.candidateProfile.profileCompleted,
  resume: response.candidateProfile.resume ?? null,
};

console.log(profile);

return profile;
};

export const updateCandidateProfile = async (
  payload: UpdateCandidateProfilePayload,
): Promise<CandidateProfile> => {
  const { data } = await api.put<{
    data: CandidateProfile;
  }>("/candidate/profile", payload);

  return data.data;
};

export const completeCandidateProfile = async (
  payload: CompleteCandidateProfilePayload,
): Promise<void> => {
  await api.put("/candidate/profile/complete", payload);
};
