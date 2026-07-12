export const RECRUITER_OFFER_ROUTES = {
  OFFERS: "/recruiter/offers",
  OFFER_DETAIL: (offerId: string) =>
    `/recruiter/offers/${offerId}`,
} as const;