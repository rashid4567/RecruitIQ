import api from "@/api/axios";
import type {
  CandidateListResponse,
  CandidateProfile,
  CandidateQueryParams,
} from "../types/candidate.types";

export const getCandidates = async (
  params: CandidateQueryParams,
): Promise<CandidateListResponse> => {
  const { data } = await api.get("/admin/candidates", {
    params,
  });

  return data.data;
};

export const getCandidateProfile = async (
  candidateId: string,
): Promise<CandidateProfile> => {
  const { data } = await api.get(
    `/admin/candidates/${candidateId}`,
  );

  return data.data;
};

export const blockCandidate = async (
  candidateId: string,
): Promise<void> => {
  await api.patch(`/admin/candidates/${candidateId}/block`);
};

export const unblockCandidate = async (
  candidateId: string,
): Promise<void> => {
  await api.patch(`/admin/candidates/${candidateId}/unblock`);
};