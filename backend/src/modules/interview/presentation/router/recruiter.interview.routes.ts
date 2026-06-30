import { Router } from "express";
import { INTERVIEW_ROUTES } from "../constants/interview.routes.constant";
import {
  scheduleInterviewController,
  getRecruiterInterviewsController,
  getRecruiterInterviewDetailsController,
  cancelinterviewcontroller,
  endInterviewcontroller,
  markRecruiterjoinedController,
  rescheduleInterviewController,
  startInterviewController,
} from "../di/interview.module";

const router = Router();

router.post(
  INTERVIEW_ROUTES.SCHEDULE,
  scheduleInterviewController.scheduleInterview,
);
router.get(
  INTERVIEW_ROUTES.GET_INTERVIEWS,
  getRecruiterInterviewsController.getRecruiterInterviews,
);
router.get(
  INTERVIEW_ROUTES.GET_INTERVIEW_DETAILS,
  getRecruiterInterviewDetailsController.getRecruiterInterviewDetails,
);
router.patch(
  INTERVIEW_ROUTES.RESCHEDULE,
  rescheduleInterviewController.reschedule,
);
router.patch(INTERVIEW_ROUTES.CANCEL, cancelinterviewcontroller.cancel);
router.patch(INTERVIEW_ROUTES.START, startInterviewController.start);
router.patch(INTERVIEW_ROUTES.END, endInterviewcontroller.end);
router.patch(INTERVIEW_ROUTES.JOIN, markRecruiterjoinedController.join);

export default router;
