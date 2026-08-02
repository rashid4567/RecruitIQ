export const CANDIDATE_OFFER_ROUTES = {
  OFFER_DETAIL: (offerId: string) =>
    `/candidate/offers/${offerId}`,

  ACCEPT: (offerId: string) =>
    `/candidate/offers/${offerId}/accept`,

  REJECT: (offerId: string) =>
    `/candidate/offers/${offerId}/reject`,
  UPLOAD_SIGNATURE: "/candidate/offers/signature",
} as const;