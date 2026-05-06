import { Router } from "express";
import {
  completeProfileController,
  getRecruiterProfile,
  updaterecruiterController,
} from "../../recruiter.module";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { checkUserActive } from "../../../../middlewares/checkUserActive.middleware";
import jobPostRouter from "./jobPost.routes";
import plansRouter from "./plans.routes"
const router = Router();

router.use(authenticate);
router.use(checkUserActive);

router.get("/profile", getRecruiterProfile.getProfile);
router.put("/profile", updaterecruiterController.updateProfile);
router.put("/complete-profile", completeProfileController.completeProfile);
router.use("/jobs", jobPostRouter);
router.use("/", plansRouter)
 
export default router;
