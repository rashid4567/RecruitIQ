import { Router } from "express";
import { blockJobPostController, getJobPopstByIdcontroller, getJobPostController, unblockJobPostController } from "../containers/jobPost.container";


const JobPostRouter = Router();

JobPostRouter.get("/", getJobPostController.jobList);

JobPostRouter.get("/:jobPostId", getJobPopstByIdcontroller.getJobPosyById);

JobPostRouter.patch("/:jobPostId/block", blockJobPostController.block);

JobPostRouter.patch("/:jobPostId/unblock", unblockJobPostController.unblock);

export default JobPostRouter;