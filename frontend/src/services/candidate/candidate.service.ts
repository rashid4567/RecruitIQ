import api from "../../api/axios";
import type {
  CandidateProfileData,
  UpdateCandidateProfilePayload,
  CandidateProfileResponse,
} from "../../types/candidate/candidate.profile.type";

export const candidateService = {
 getProfile: async (): Promise<CandidateProfileResponse> => {
  try {
    const res = await api.get("/candidate/profile");
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch candidate profile", error);
    throw error;
  }
},


  completeProfile: async (
    payload: UpdateCandidateProfilePayload
  ): Promise<CandidateProfileData> => {
    const res = await api.put("/candidate/profile/complete", payload);
    return res.data.data;
  },
  updateProfile: async (
  payload: UpdateCandidateProfilePayload
): Promise<CandidateProfileData> => {
  const res = await api.put("/candidate/profile", payload);
  return res.data.data;
},

};
