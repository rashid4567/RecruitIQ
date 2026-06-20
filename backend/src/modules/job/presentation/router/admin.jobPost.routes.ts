import { Router } from "express";

import {
  adminJobsController,
  adminJobByIdController,
  blockJobController,
  unblockJobController,
} from "../container/jobpost.module";
import { JOB_ROUTES } from "../constant/job-routes.constants";

const JobPostRouter = Router();

JobPostRouter.get(JOB_ROUTES.ADMIN.ROOT, adminJobsController.getAll);
JobPostRouter.get(JOB_ROUTES.ADMIN.BY_ID, adminJobByIdController.getOne);
JobPostRouter.patch(JOB_ROUTES.ADMIN.BLOCK, blockJobController.block);
JobPostRouter.patch(JOB_ROUTES.ADMIN.UNBLOCK, unblockJobController.unblock);

export default JobPostRouter;
