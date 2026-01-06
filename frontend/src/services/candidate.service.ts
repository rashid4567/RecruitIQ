// src/services/candidate.service.ts
import api from "../api/axios";

export interface UpdateCandidateProfilePayload {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocation?: string[];
  linkedinUrl?: string;
  profileCompleted?: boolean; 
}


export const candidateService = {
  getProfile: async () => {
    const res = await api.get("/candidate/profile");
    return res.data;
  },

  updateProfile: async (payload: UpdateCandidateProfilePayload) => {
    const res = await api.put("/candidate/profile", payload);
    return res.data;
  },
};
