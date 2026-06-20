import { Router } from "express";
import {
  otpController,
  registrationController,
} from "../container/auth.container";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();

router.post(AUTH_ROUTES.SEND_OTP, otpController.sendOtp);
router.post(AUTH_ROUTES.VERIFY_OTP, registrationController.register);

export default router;
