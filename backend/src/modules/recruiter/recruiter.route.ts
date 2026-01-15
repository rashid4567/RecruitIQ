// src/recruiter/recruiter.routes.ts
import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  getRecruiterProfile,
  updateRecruiterPassword,
  updateRecruiterProfile,
} from "./recruiter.controller";
import { checkUserActive } from "../../middlewares/checkUserActive.middleware";
const router = Router();
router.use(authenticate);
router.use(checkUserActive)

router.get("/profile", getRecruiterProfile);
router.put("/profile", updateRecruiterProfile);
router.put("/profile/password", updateRecruiterPassword)

router.put("/complete-profile", updateRecruiterProfile);

export default router;
