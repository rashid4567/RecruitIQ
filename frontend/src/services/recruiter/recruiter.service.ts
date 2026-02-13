import api from "@/api/axios";
import type { RecruiterProfileData, RecruiterProfileResponse } from "../../types/recruiter/recruiter.profile.type";

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

  updatePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put("/recruiter/profile/password", payload);
  },

 requestEmailUpdate: async (newEmail: string): Promise<void> => {
  await api.put("/recruiter/email/request-otp", {
    newEmail,
  });
},


  verifyEmail : async (payload : {
    newEmail : string,
    otp : string,
  }): Promise<void> =>{
    await api.post("/recruiter/email/verify",payload)
  }
};