import { Router } from "express";
import { otpController, registrationController } from "../../auth.module";

const router = Router();

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", registrationController.register);

export default router;
