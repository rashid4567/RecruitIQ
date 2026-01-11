import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getCandidateProfile,
  updateCandidateProfile,
} from "./candidate.controller";
import { checkUserActive } from "../middlewares/checkUserActive.middleware";
const router = Router();
router.use(checkUserActive)
router.use(authenticate)

router.get("/profile", getCandidateProfile);
router.put("/profile/complete", updateCandidateProfile);

export default router;
