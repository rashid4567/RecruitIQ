import { Router } from "express";

import authRoutes from "./auth.routes";
import googleRoutes from "./google/google.route";
import linkedinRoutes from "./linkedin/linkedin.routes";

const router = Router();

// Core auth routes (email / otp / refresh)
router.use("/", authRoutes);

// OAuth providers
router.use("/google", googleRoutes);
router.use("/linkedin", linkedinRoutes);

export default router;
