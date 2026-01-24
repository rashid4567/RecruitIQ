import api from "../../api/axios";
import type {
  CandidateProfileData,
  CandidateProfileResponse,
  UpdateCandidateProfileRequest,
} from "../../types/candidate/candidate.profile.type";

export const candidateService = {
  getProfile: async (): Promise<CandidateProfileResponse> => {
    const res = await api.get("/candidate/profile");
    return res.data.data;
  },

  completeProfile: async (
    payload: UpdateCandidateProfileRequest
  ): Promise<CandidateProfileData> => {
    const res = await api.put("/candidate/profile/complete", payload);
    return res.data.data;
  },

  updateProfile: async (
    payload: UpdateCandidateProfileRequest
  ): Promise<CandidateProfileData> => {
    const res = await api.put("/candidate/profile", payload);
    return res.data.data;
  },

  updatePassword: async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await api.put("/candidate/password", payload);
  return res.data;
},

  requestEmailUpdate : async (newEmail  :string):Promise<void> =>{
    await api.put("/candidate/email/request-otp",{newEmail})
  },

  verifyEmailUpdate : async (payload : {
    newEmail : string,
    otp : string,
  }):Promise<void> =>{
    await api.post("/candidate/email/verify",payload)
  }
};
