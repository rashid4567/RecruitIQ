import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getCandidateProfile,
  updateCandidateProfile,
  updatePassword,
} from "./candidate.controller";
import { checkUserActive } from "../middlewares/checkUserActive.middleware";
const router = Router();

router.use(authenticate)
router.use(checkUserActive)
router.get("/profile", getCandidateProfile);
router.put("/profile",updateCandidateProfile)
router.put("/profile/complete", updateCandidateProfile);
router.put("/password",updatePassword)
export default router;
