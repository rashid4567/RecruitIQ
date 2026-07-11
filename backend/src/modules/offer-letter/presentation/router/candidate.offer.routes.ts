import { Router } from "express";

import {
  acceptCandidateOfferController,
  getcandidateofferController,
  rejectcandidateofferController,
} from "../container/job-offer.module";

import { OFFER_ROUTES } from "../constant/offer-routes.constants";

const router = Router();

router.get(
  OFFER_ROUTES.CANDIDATE.OFFER_DETAIL,
  getcandidateofferController.getOffer,
);

router.patch(
  OFFER_ROUTES.CANDIDATE.ACCEPT_OFFER,
  acceptCandidateOfferController.accept,
);

router.patch(
  OFFER_ROUTES.CANDIDATE.REJECT_OFFER,
  rejectcandidateofferController.reject,
);

export default router;
