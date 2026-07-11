export const OFFER_ROUTES = {
  RECRUITER: {
    OFFERS: "/",
    OFFER_DETAIL: "/:offerId",
  },

  CANDIDATE: {
    OFFER_DETAIL: "/:offerId",
    ACCEPT_OFFER: "/:offerId/accept",
    REJECT_OFFER: "/:offerId/reject",
  },
} as const;