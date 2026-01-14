import { Router } from "express";
import { authController } from "../auth.module";

const router = Router();

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.register);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
