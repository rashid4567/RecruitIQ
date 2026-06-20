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
router.use(AUTH_ROUTES.ROOT, forgotPasswordRouters);
router.use(AUTH_ROUTES.ROOT, authRoutes);
router.use(AUTH_ROUTES.ROOT, otpRoutes);
router.use(AUTH_ROUTES.ROOT, tokenRoutes);
router.use(AUTH_ROUTES.ROOT, UpdatepasswordRoutes);
router.use(AUTH_ROUTES.ROOT, emailUpdateRoutes);
router.use(AUTH_ROUTES.ROOT, profileUpdateRoutes);

export default router;
