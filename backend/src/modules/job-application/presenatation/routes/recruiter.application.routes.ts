import { Router } from "express";
import {
  getApplicationByjobpostController,
  getRecruiterApplicationDetailsController,
  updateApplicationStatuscontroller,
} from "../container/JobApplication.module";

const router = Router();

router.get(
  "/:jobId/applications",
  getApplicationByjobpostController.GetJobpostBasedApplicatiton,
);
router.get(
  "/applications/:applicationId",
  getRecruiterApplicationDetailsController.getApplicationDetails,
);
router.patch(
  "/applications/:applicationId/status",
  updateApplicationStatuscontroller.updateStatus,
);

export default router;
