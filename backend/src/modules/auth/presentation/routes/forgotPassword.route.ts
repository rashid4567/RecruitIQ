import { Router } from "express";
import { ForgotpasswordController } from "../container/auth.container";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();
router.post(AUTH_ROUTES.FORGOT_PASSWORD, ForgotpasswordController.forgotPassword);
router.post(AUTH_ROUTES.VERIFY_OTP, ForgotpasswordController.resetPassword);


export default router;