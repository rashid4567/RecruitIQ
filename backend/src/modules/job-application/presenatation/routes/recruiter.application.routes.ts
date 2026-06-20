import { Router } from "express";
import {
  getApplicationByjobpostController,
  getRecruiterApplicationDetailsController,
  updateApplicationStatuscontroller,
} from "../container/JobApplication.module";
import { JOB_APPLICATION_ROUTES } from "../constants/job-application-routes.constants";

const router = Router();

router.get(
  JOB_APPLICATION_ROUTES.RECRUITER.JOB_APPLICATIONS,
  getApplicationByjobpostController.GetJobpostBasedApplicatiton,
);
router.get(
  JOB_APPLICATION_ROUTES.RECRUITER.APPLICATION_DETAILS,
  getRecruiterApplicationDetailsController.getApplicationDetails,
);
router.patch(
  JOB_APPLICATION_ROUTES.RECRUITER.UPDATE_STATUS,
  updateApplicationStatuscontroller.updateStatus,
);

export default router;
