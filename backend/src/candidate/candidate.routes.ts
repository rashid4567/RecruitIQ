import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getCandidateProfile,
  updateCandidateProfile,
} from "./candidate.controller";
import { checkUserActive } from "../middlewares/checkUserActive.middleware";
const router = Router();

router.use(authenticate)
router.use(checkUserActive)
router.get("/profile", getCandidateProfile);
router.put("/profile/complete", updateCandidateProfile);

export default router;
