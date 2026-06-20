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
import { RESUME_ROUTES } from "../constants/resume-routes.constants";

const router = Router();
router.post(
  RESUME_ROUTES.UPLOAD,
  resumeUploadMiddleware,
  uploadResumeController.handle,
);
router.get(RESUME_ROUTES.MY_RESUME, getResumeByCandidateController.handle);
router.delete(RESUME_ROUTES.MY_RESUME, deleteMyResumeController.handle);
router.get(RESUME_ROUTES.BY_ID, getResumeByIdController.handle);
router.get(RESUME_ROUTES.DOWNLOAD, DownloadResumecontroller.downloadResume);
router.delete(RESUME_ROUTES.BY_ID, deleteResumeController.handle);

export default router;
