import { Router } from "express";

import {
  acceptCandidateOfferController,
  getcandidateofferController,
  rejectcandidateofferController,
  uploadSignatureController,
} from "../container/job-offer.module";

import { OFFER_ROUTES } from "../constant/offer-routes.constants";
import { signatureUploadMiddleware } from "../middleware/signature.upload.middleware";

const router = Router();

router.get(
  OFFER_ROUTES.CANDIDATE.OFFER_DETAIL,
  getcandidateofferController.getOffer,
);

router.patch(
  OFFER_ROUTES.CANDIDATE.ACCEPT_OFFER,
  acceptCandidateOfferController.accept,
);

router.post(
  OFFER_ROUTES.CANDIDATE.UPLOAD_SIGNATURE,
  signatureUploadMiddleware,
  uploadSignatureController.upload,
);

router.patch(
  OFFER_ROUTES.CANDIDATE.REJECT_OFFER,
  rejectcandidateofferController.reject,
);

export default router;
