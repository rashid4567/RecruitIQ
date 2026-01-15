import { Router } from "express";
import { authController, googleController } from "../auth.module";

const router = Router();

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.register);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
console.log("google login router registered")
router.post("/google/login", googleController.login);

export default router;
