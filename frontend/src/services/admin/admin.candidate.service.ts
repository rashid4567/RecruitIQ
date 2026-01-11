import api from "../../api/axios";
import type {
  CandidateListResponse,
  CandidateProfile,
  GetCandidatesParams,
} from "../../types/admin/candidate.types";

export const candidateService = {
  getCandidates: async (
    params: GetCandidatesParams
  ): Promise<CandidateListResponse> => {
    const { data } = await api.get("/admin/candidates", { params });
    return data.data;
  },

  getCandidateProfile: async (
    candidateId: string
  ): Promise<CandidateProfile> => {
    const { data } = await api.get(`/admin/candidates/${candidateId}`);
    return data.data;
  },

  blockCandidate: async (candidateId: string) => {
    return api.patch(`/admin/candidates/${candidateId}/block`);
  },
  unblockCandidate: async (candidateId: string) => {
    return api.patch(`/admin/candidates/${candidateId}/unblock`);
  },
};
