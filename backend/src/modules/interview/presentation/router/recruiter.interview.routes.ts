import { Router } from "express";
import { INTERVIEW_ROUTES } from "../constants/interview.routes.constant";
import { scheduleInterviewController } from "../di/interview.module";


const router = Router();

router.post(INTERVIEW_ROUTES.SCHEDULE, scheduleInterviewController.scheduleInterview)


export default router;