import { Router } from "express";
import {
  getApplicationByjobpostController,
  updateApplicationStatuscontroller,
} from "../container/JobApplication.module";

const router = Router();

router.get(
  "/:jobId/applications",
  getApplicationByjobpostController.GetJobpostBasedApplicatiton,
);
router.get(
  "/applications/:applicationId",
  getApplicationByjobpostController.GetJobpostBasedApplicatiton,
);
router.patch(
  "/applications/:applicationId/status",
  updateApplicationStatuscontroller.updateStatus,
);

export default router;
