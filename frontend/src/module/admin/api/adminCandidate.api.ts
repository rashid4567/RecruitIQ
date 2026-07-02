import api from "@/api/axios";

import { CANDIDATE_ROUTES } from "../constant/candidate.routes";
import type {
  CandidateListResponse,
  CandidateProfile,
  CandidateQueryParams,
} from "../types/candidate.types";

export const getCandidates = async (
  params: CandidateQueryParams,
): Promise<CandidateListResponse> => {
  const { data } = await api.get(CANDIDATE_ROUTES.GET_CANDIDATES, {
    params,
  });

  return data.data;
};

export const getCandidateProfile = async (
  candidateId: string,
): Promise<CandidateProfile> => {
  const { data } = await api.get(
    CANDIDATE_ROUTES.GET_CANDIDATE_PROFILE(candidateId),
  );

  return data.data;
};

export const blockCandidate = async (
  candidateId: string,
): Promise<void> => {
  await api.patch(CANDIDATE_ROUTES.BLOCK_CANDIDATE(candidateId));
};

export const unblockCandidate = async (
  candidateId: string,
): Promise<void> => {
  await api.patch(CANDIDATE_ROUTES.UNBLOCK_CANDIDATE(candidateId));
};