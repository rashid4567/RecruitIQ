// src/services/recruiter.service.ts
import api from "axios";

export interface RecruiterProfileData {
  companyName: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  bio?: string;
  designation?: string;
}

export const recruiterService = {
  // Get recruiter profile
  getProfile: async () => {
    const response = await api.get("/recruiter/complete-profile");
    return response.data;
  },

  // Update recruiter profile
  updateProfile: async (data: RecruiterProfileData) => {
    const response = await api.put("/recruiter/complete-profile", data);
    return response.data;
  },

  // Create initial profile (for signup)
  createProfile: async (data: RecruiterProfileData & { subscriptionStatus?: string }) => {
    // You might need a different endpoint for initial creation
    const response = await api.post("/recruiter/complete-profile", data);
    return response.data;
  }
};