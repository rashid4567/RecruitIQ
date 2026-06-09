import { Router } from "express";

import authRoutes from "./auth.routes";
import otpRoutes from "./otp.routes";
import tokenRoutes from "./token.routes";
import UpdatepasswordRoutes from "./password.routes";
import forgotPasswordRouters from "./forgotPassword.route"
import socialRoutes from "./social.routes";
import emailUpdateRoutes from "./email.update.routes"; 
import profileUpdateRoutes from "./profile-image.routes"

const router = Router();

router.use("/google", socialRoutes);
router.use("/", forgotPasswordRouters);
router.use("/", authRoutes);
router.use("/", otpRoutes);
router.use("/", tokenRoutes);
router.use("/", UpdatepasswordRoutes);
router.use("/", emailUpdateRoutes)
router.use("/",profileUpdateRoutes);

export default router;
