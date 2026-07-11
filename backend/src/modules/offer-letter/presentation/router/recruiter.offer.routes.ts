import { Router } from "express";

import {
  createOfferController,
  getofferDetailsController,
  getrecruiterOffersController,
} from "../container/job-offer.module";

import { OFFER_ROUTES } from "../constant/offer-routes.constants";

const router = Router();

router.post(OFFER_ROUTES.RECRUITER.OFFERS, createOfferController.create);
router.get(
  OFFER_ROUTES.RECRUITER.OFFERS,
  getrecruiterOffersController.getOffers,
);
router.get(
  OFFER_ROUTES.RECRUITER.OFFER_DETAIL,
  getofferDetailsController.getDetails,
);

export default router;
