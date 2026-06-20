import { Router } from "express";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { checkUserActive } from "../../../../shared/middlewares/checkUserActive.middleware";
import {
  candidateController,
  getprofileController,
  updateprofileController,
} from "../container/candidate.module";
import jobPostRouter from "../../../job/presentation/router/candidate.jobPost.routes";
import resumeRouter from "../../../resume/presentation/routes/resume.routes";
import candidateApplicationRouter from "../../../job-application/presenatation/routes/candidate.Application.routes";
import { CANDIDATE_ROUTES } from "../constants/candidate-routes.constants";

const router = Router();
router.use(authenticate);
router.use(checkUserActive);

router.get(CANDIDATE_ROUTES.PROFILE, getprofileController.getProfile);
router.put(CANDIDATE_ROUTES.PROFILE, updateprofileController.updateProfile);
router.put(
  CANDIDATE_ROUTES.COMPLETE_PROFILE,
  candidateController.completeProfile,
);
router.use(CANDIDATE_ROUTES.RESUME, resumeRouter);
router.use(CANDIDATE_ROUTES.JOBS, jobPostRouter);
router.use(CANDIDATE_ROUTES.APPLICATIONS, candidateApplicationRouter);

export default router;
