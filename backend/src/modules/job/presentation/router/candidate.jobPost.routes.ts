import { Router } from "express";
import {
  candidateJobIdController,
  candidateJobsController,
} from "../container/jobpost.module";
import { JOB_ROUTES } from "../constant/job-routes.constants";

const jobPostRouter = Router();

jobPostRouter.get(JOB_ROUTES.CANDIDATE.ROOT, candidateJobsController.getAll);
jobPostRouter.get(JOB_ROUTES.CANDIDATE.BY_ID, candidateJobIdController.getOne);

export default jobPostRouter;
