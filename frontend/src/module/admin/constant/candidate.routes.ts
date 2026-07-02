export const CANDIDATE_ROUTES = {
  GET_CANDIDATES: "/admin/candidates",

  GET_CANDIDATE_PROFILE: (candidateId: string) =>
    `/admin/candidates/${candidateId}`,

  BLOCK_CANDIDATE: (candidateId: string) =>
    `/admin/candidates/${candidateId}/block`,

  UNBLOCK_CANDIDATE: (candidateId: string) =>
    `/admin/candidates/${candidateId}/unblock`,
} as const;