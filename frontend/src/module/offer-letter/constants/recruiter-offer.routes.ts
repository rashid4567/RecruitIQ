export const RECRUITER_OFFER_ROUTES = {
  OFFERS: "/offers",
  OFFER_DETAIL: (offerId: string) =>
    `/offers/${offerId}`,
} as const;