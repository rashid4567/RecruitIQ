import { Router } from "express";
import {
  applyController,
  getApplicationDetailController,
  MyApplicationController,
  withdrawApplicationController,
} from "../container/JobApplication.module";

const router = Router();
router.get("/", MyApplicationController.getMyApplication);
router.post("/:jobId/apply", applyController.apply);
router.patch(
  "/:applicationId/withdraw",
  withdrawApplicationController.withdraw,
);
router.get("/:applicationId",getApplicationDetailController.ApplicationDetail);
export default router;
