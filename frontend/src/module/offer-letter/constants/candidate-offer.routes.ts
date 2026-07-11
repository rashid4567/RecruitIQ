export const CANDIDATE_OFFER_ROUTES = {
  OFFER_DETAIL: (offerId: string) =>
    `/offers/${offerId}`,

  ACCEPT: (offerId: string) =>
    `/offers/${offerId}/accept`,

  REJECT: (offerId: string) =>
    `/offers/${offerId}/reject`,
} as const;