import { Router } from "express";
import {
  createJobPostContoller,
  deleteJobPostController,
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
router.delete("/:id", deleteJobPostController.handle)

export default router;
