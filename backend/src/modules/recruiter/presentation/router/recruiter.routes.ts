import { Router } from "express";
import {
  completeProfileController,
  getRecruiterProfile,
  updaterecruiterController,
} from "../container/recruiter.module";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { checkUserActive } from "../../../../shared/middlewares/checkUserActive.middleware"; 
import jobPostRouter from "../../../job/presentation/router/Recruiter.jobPost.routes";
import plansRouter from "../../../subscription/presentation/routes/recruiter.subscription.routes"
import { RECRUITER_ROUTES } from "../constants/recruiter-routes.constants";
const router = Router();

router.use(authenticate);
router.use(checkUserActive);

router.get(RECRUITER_ROUTES.PROFILE, getRecruiterProfile.getProfile);
router.put(RECRUITER_ROUTES.PROFILE, updaterecruiterController.updateProfile);
router.put(RECRUITER_ROUTES.COMPLETE_PROFILE, completeProfileController.completeProfile);
router.use(RECRUITER_ROUTES.JOBS, jobPostRouter);
router.use(RECRUITER_ROUTES.ROOT, plansRouter)
 
export default router;
