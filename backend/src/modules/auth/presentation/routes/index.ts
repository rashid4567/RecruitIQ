import { Router } from "express";

import authRoutes from "./auth.routes";
import otpRoutes from "./otp.routes";
import tokenRoutes from "./token.routes";
import UpdatepasswordRoutes from "./password.routes";
import forgotPasswordRouters from "./forgotPassword.route";
import socialRoutes from "./social.routes";
import emailUpdateRoutes from "./email.update.routes";
import profileUpdateRoutes from "./profile-image.routes";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();

router.use(AUTH_ROUTES.GOOGLE, socialRoutes);
router.use("/", forgotPasswordRouters);
router.use("/", authRoutes);
router.use("/", otpRoutes);
router.use("/", tokenRoutes);
router.use("/", UpdatepasswordRoutes);
router.use("/", emailUpdateRoutes);
router.use("/", profileUpdateRoutes);

export default router;
