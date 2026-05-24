import { Router } from "express";

import {
  adminJobsController,
  adminJobByIdController,
  blockJobController,
  unblockJobController,
} from "../container/jobpost.module";

const JobPostRouter = Router();

JobPostRouter.get("/", adminJobsController.getAll);
JobPostRouter.get("/:jobPostId", adminJobByIdController.getOne);
JobPostRouter.patch("/:jobPostId/block", blockJobController.block);
JobPostRouter.patch("/:jobPostId/unblock", unblockJobController.unblock);

export default JobPostRouter;
