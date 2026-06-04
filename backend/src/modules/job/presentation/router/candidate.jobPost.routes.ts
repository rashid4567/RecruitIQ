import { Router } from "express";
import {
  candidateJobIdController,
  candidateJobsController,
} from "../container/jobpost.module";
import candidateApplicationRouter from "../../../job-application/presenatation/routes/candidate.Application.routes";

const jobPostRouter = Router();

jobPostRouter.get("/", candidateJobsController.getAll);
jobPostRouter.get("/:id", candidateJobIdController.getOne);

jobPostRouter.use("/", candidateApplicationRouter);

export default jobPostRouter;
