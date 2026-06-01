import { Router } from "express";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { checkUserActive } from "../../../../shared/middlewares/checkUserActive.middleware";
import {
  candidateController,
  getprofileController,
  updateprofileController,
} from "../container/candidate.module"
import jobPostRouter from "../../../job/presentation/router/candidate.jobPost.routes";
import resumeRouter from "../../../resume/presentation/routes/resume.routes"

const router = Router();

router.use(authenticate);
router.use(checkUserActive);

router.get("/profile", getprofileController.getProfile);
router.put("/profile", updateprofileController.updateProfile);
router.put("/profile/complete", candidateController.completeProfile);


router.use("/resume", resumeRouter )
router.use("/jobs", jobPostRouter);

export default router;
