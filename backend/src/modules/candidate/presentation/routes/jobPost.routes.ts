import { Router } from "express";
import {
  getJobPostByIdController,
  getJobPostController,
} from "../../jobPost.module";

const jobPostRouter = Router();

jobPostRouter.get("/", getJobPostController.getAllJobPost);
jobPostRouter.get("/:id", getJobPostByIdController.getJobPostById);

export default jobPostRouter;
