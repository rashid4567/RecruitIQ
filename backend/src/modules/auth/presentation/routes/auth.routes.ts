import { Router } from "express";
import {
  adminAuthcontroller,
  authController,
  googleController,
  otpController,
  passwordController,
  registrationController,
  tokenController,
} from "../../auth.module";

const router = Router();

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", registrationController.register);
router.post("/login", authController.login);
router.post("/admin/login", adminAuthcontroller.login);
router.post("/refresh", tokenController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", passwordController.forgotPassword);
router.post("/reset-password", passwordController.resetPassword);

router.post("/google/login", googleController.login);

export default router;
