import api from "@/api/axios";
import type { RecruiterProfileData, RecruiterProfileResponse } from "../../types/recruiter/recruiter.profile.type";

export const recruiterService = {
  getProfile: async (): Promise<RecruiterProfileResponse> => {
    const res = await api.get("/recruiter/profile");
    return res.data.data;
  },

  // Changed to accept RecruiterProfileData instead of RecruiterProfileResponse
  updateProfile: async (
    payload: RecruiterProfileData
  ): Promise<RecruiterProfileResponse> => {
    const res = await api.put("/recruiter/profile", payload);
    return res.data.data;
  },

  updatePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put("/recruiter/profile/password", payload);
  }
};