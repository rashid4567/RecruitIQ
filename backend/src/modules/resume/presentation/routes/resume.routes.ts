import { Router } from "express";
import { resumeUploadMiddleware } from "../middleware/resume-upload.middleware";
import {
  deleteMyResumeController,
  deleteResumeController,
  DownloadResumecontroller,
  getResumeByCandidateController,
  getResumeByIdController,
  uploadResumeController,
} from "../container/resume.module";

const router = Router();
router.post("/upload", resumeUploadMiddleware, uploadResumeController.handle);
router.get("/me", getResumeByCandidateController.handle);
router.delete("/me", deleteMyResumeController.handle);
router.get("/:resumeId", getResumeByIdController.handle);
router.get("/:resumeId/download", DownloadResumecontroller.downloadResume);
router.delete("/:resumeId", deleteResumeController.handle);

export default router;
