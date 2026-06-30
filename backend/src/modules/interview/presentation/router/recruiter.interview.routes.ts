import { Router } from "express";
import { INTERVIEW_ROUTES } from "../constants/interview.routes.constant";
import {
  scheduleInterviewController,
  getRecruiterInterviewsController,
  getRecruiterInterviewDetailsController,
} from "../di/interview.module";

const router = Router();

router.post(
  INTERVIEW_ROUTES.SCHEDULE,
  scheduleInterviewController.scheduleInterview,
);

router.get(
  INTERVIEW_ROUTES.GET_RECRUITER_INTERVIEWS,
  getRecruiterInterviewsController.getRecruiterInterviews,
);

router.get(
  INTERVIEW_ROUTES.GET_RECRUITER_INTERVIEW_DETAILS,
  getRecruiterInterviewDetailsController.getRecruiterInterviewDetails,
);

export default router;