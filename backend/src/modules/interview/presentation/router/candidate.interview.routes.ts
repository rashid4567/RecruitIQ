import { Router } from "express";
import { INTERVIEW_ROUTES } from "../constants/interview.routes.constant";
import {
  getcandidateInterviewsController,
  getcandidateInterviewDetailsController,
  joinInterviewController,
  acceptInterviewController,
  rejectInterviewControlelr,
  requestRescheduleController,
} from "../di/interview.module";

const router = Router();

router.get(
  INTERVIEW_ROUTES.GET_INTERVIEWS,
  getcandidateInterviewsController.candidateInterviews,
);
router.get(
  INTERVIEW_ROUTES.GET_INTERVIEW_DETAILS,
  getcandidateInterviewDetailsController.getDetails,
);
router.patch(INTERVIEW_ROUTES.ACCEPT, acceptInterviewController.accept);
router.patch(INTERVIEW_ROUTES.REJECT, rejectInterviewControlelr.reject);
router.patch(
  INTERVIEW_ROUTES.REQUEST_RESCHEDULE,
  requestRescheduleController.request,
);

router.patch(INTERVIEW_ROUTES.JOIN, joinInterviewController.join);

export default router;
