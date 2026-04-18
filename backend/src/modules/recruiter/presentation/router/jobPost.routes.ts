import { Router } from "express";
import {
  createJobPostContoller,
  getJobPostByIdController,
  getRecruiterJobPostController,
  jobPostStatusController,
  updateJobPostController,
} from "../../jobPost.module";

const router = Router();

router.post("/create", createJobPostContoller.create);
router.get("/", getRecruiterJobPostController.getAll);
router.get("/:id", getJobPostByIdController.getOne);
router.put("/:id", updateJobPostController.update);
router.patch("/:id/hide", jobPostStatusController.hide);
router.patch("/:id/unhide", jobPostStatusController.unhide);

export default router;
