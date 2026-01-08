import { Router } from "express";
import {
  login,
  refreshToken,
  sendRegistrationOTP,
  verifyRegistration,
  testCookies,
} from "./auth.controller";

const router = Router();
router.post("/login", login);
router.post("/refresh", refreshToken);


router.post("/send-otp", sendRegistrationOTP);
router.post("/verify-otp", verifyRegistration);

router.get("/test-cookies", testCookies);

export default router;
