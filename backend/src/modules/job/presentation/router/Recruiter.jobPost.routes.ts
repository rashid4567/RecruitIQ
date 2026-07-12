import { Router } from "express";
import {
  createJobController,
  recruiterJobsController,
  getJobByIdController,
  updateJobController,
  publishJobController,
  deleteJobController,
  toggleJobVisibilityController,
  closeJobcontroller,
} from "../container/jobpost.module";

import JobApplicationRouter from "../../../job-application/presenatation/routes/recruiter.application.routes";
import { JOB_ROUTES } from "../constant/job-routes.constants";

const router = Router();

router.post(JOB_ROUTES.RECRUITER.CREATE, createJobController.create);
router.use("/", JobApplicationRouter);
router.get(JOB_ROUTES.RECRUITER.ROOT, recruiterJobsController.getAll);
router.patch(JOB_ROUTES.RECRUITER.PUBLISH, publishJobController.publish);
router.patch(JOB_ROUTES.RECRUITER.HIDE, toggleJobVisibilityController.hide);
router.patch(JOB_ROUTES.RECRUITER.UNHIDE, toggleJobVisibilityController.unhide);
router.patch(JOB_ROUTES.RECRUITER.CLOSE, closeJobcontroller.close);
router.get(JOB_ROUTES.RECRUITER.BY_ID, getJobByIdController.getOne);
router.put(JOB_ROUTES.RECRUITER.BY_ID, updateJobController.update);
router.delete(JOB_ROUTES.RECRUITER.BY_ID, deleteJobController.delete);

export default router;
