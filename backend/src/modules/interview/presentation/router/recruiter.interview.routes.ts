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
  acceptReschduleInterviewController,
  rejectRescheduleInterviewController,
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
router.patch(
  INTERVIEW_ROUTES.ACCEPT_RESCHEDULE,
  acceptReschduleInterviewController.acceptRequest,
);
router.patch(
  INTERVIEW_ROUTES.REJECT_RESCHEDULE,
  rejectRescheduleInterviewController.rejectRequest,
);
export default router;
