import { Router } from "express";

import {
  createJobController,
  recruiterJobsController,
  getJobByIdController,
  updateJobController,
  publishJobController,
  deleteJobController,
  toggleJobVisibilityController,
} from "../container/jobpost.module";
import JobApplicationRouter from "../../../job-application/presenatation/routes/recruiter.application.routes"

const router = Router();

router.post("/create", createJobController.create);
router.get("/", recruiterJobsController.getAll);
router.get("/:id", getJobByIdController.getOne);
router.patch("/:id/publish", publishJobController.publish);
router.put("/:id", updateJobController.update);
router.patch("/:id/hide", toggleJobVisibilityController.hide);
router.patch("/:id/unhide", toggleJobVisibilityController.unhide);
router.delete("/:id", deleteJobController.delete);


router.use("/",JobApplicationRouter)

export default router;
