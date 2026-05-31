import { Router } from "express";
import {
  candidateJobIdController,
  candidateJobsController,
} from "../container/jobpost.module";

const jobPostRouter = Router();

jobPostRouter.get("/", candidateJobsController.getAll);
jobPostRouter.get("/:id", candidateJobIdController.getOne);

export default jobPostRouter;
