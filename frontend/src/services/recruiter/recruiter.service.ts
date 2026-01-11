import api from "@/api/axios";
import type {  RecruiterProfileData, RecruiterProfileResponse } from "../../types/recruiter/recruiter.profile.type";


export const recruiterService = {

  getProfile: async (): Promise<RecruiterProfileResponse> => {
    const res = await api.get("/recruiter/profile");
    return res.data.data;
  },

  updateProfile: async (
    payload: RecruiterProfileData
  ): Promise<RecruiterProfileResponse> => {
    const res = await api.put("/recruiter/profile", payload);
    return res.data.data;
  },
};
