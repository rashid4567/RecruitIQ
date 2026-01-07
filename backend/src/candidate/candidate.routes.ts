import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getCandidateProfile,
  updateCandidateProfile,
} from "./candidate.controller";

const router = Router();

router.get("/profile", authenticate, getCandidateProfile);
router.put("/profile", authenticate, updateCandidateProfile);

export default router;
