import { Router } from "express";
import {
  applyController,
  getApplicationDetailController,
  MyApplicationController,
  withdrawApplicationController,
} from "../container/JobApplication.module";
import { JOB_APPLICATION_ROUTES } from "../constants/job-application-routes.constants";

const router = Router();
router.get(
  JOB_APPLICATION_ROUTES.CANDIDATE.ROOT,
  MyApplicationController.getMyApplication,
);
router.post(JOB_APPLICATION_ROUTES.CANDIDATE.APPLY, applyController.apply);
router.patch(
  JOB_APPLICATION_ROUTES.CANDIDATE.WITHDRAW,
  withdrawApplicationController.withdraw,
);
router.get(
  JOB_APPLICATION_ROUTES.CANDIDATE.DETAILS,
  getApplicationDetailController.ApplicationDetail,
);
export default router;
