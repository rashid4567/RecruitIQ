import { Router } from "express";

import authRoutes from "./auth.routes";
import otpRoutes from "./otp.routes";
import tokenRoutes from "./token.routes";
import passwordRoutes from "./password.routes";
import socialRoutes from "./social.routes";

const router = Router();

router.use("/google", socialRoutes);
router.use("/", authRoutes);
router.use("/", otpRoutes);
router.use("/", tokenRoutes);
router.use("/", passwordRoutes);


export default router;
