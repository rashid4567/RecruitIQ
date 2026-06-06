import { Router } from "express";
import { getApplicationByjobpostController } from "../container/JobApplication.module";

const router = Router();

router.get(
  "/:jobId/applications",
  getApplicationByjobpostController.GetJobpostBasedApplicatiton,
);

export default router;
