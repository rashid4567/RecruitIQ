import { Router } from "express";
import { resumeUploadMiddleware } from "../../../../shared/middlewares/resume-upload.middleware";
import {
  deleteMyResumeController,
  deleteResumeController,
  getResumeByCandidateController,
  getResumeByIdController,
  uploadResumeController,
} from "../container/resume.module";

const router = Router();
router.post("/upload", resumeUploadMiddleware, uploadResumeController.handle);

router.get("/me", getResumeByCandidateController.handle);

router.delete("/me", deleteMyResumeController.handle);

router.get("/:resumeId", getResumeByIdController.handle);

router.delete("/:resumeId", deleteResumeController.handle);
export default router;
