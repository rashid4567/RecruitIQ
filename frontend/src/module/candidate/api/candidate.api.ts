import api from "@/api/axios";
import { CANDIDATE_PROFILE_ROUTES } from "../constants/candidate-profile.routes";

import type {
  CandidateProfile,
  CandidateProfileApiResponse,
  CompleteCandidateProfilePayload,
  UpdateCandidateProfilePayload,
} from "../types/candidate.types";

function mapCandidateProfile(
  response: CandidateProfileApiResponse,
): CandidateProfile {
  return {
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
}

export const getCandidateProfile = async (): Promise<CandidateProfile> => {
  const { data } = await api.get<{
    data: CandidateProfileApiResponse;
  }>(CANDIDATE_PROFILE_ROUTES.GET_PROFILE);

  return mapCandidateProfile(data.data);
};

export const updateCandidateProfile = async (
  payload: UpdateCandidateProfilePayload,
): Promise<CandidateProfile> => {
  const { data } = await api.put<{
    data: CandidateProfileApiResponse;
  }>(CANDIDATE_PROFILE_ROUTES.UPDATE_PROFILE, payload);
  console.log("UPDATE RESPONSE", data);

  return mapCandidateProfile(data.data);
};

export const completeCandidateProfile = async (
  payload: CompleteCandidateProfilePayload,
): Promise<void> => {
  await api.put(
    CANDIDATE_PROFILE_ROUTES.COMPLETE_PROFILE,
    payload,
  );
};