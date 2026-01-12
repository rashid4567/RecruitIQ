import { Router } from "express";
import {
  login,
  refreshToken,
  sendRegistrationOTP,
  verifyRegistration,
  testCookies,
  adminLogin,
  logout,
} from "./auth.controller";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();



router.post("/login", login);
router.post("/admin/login",adminLogin);
router.post("/refresh", refreshToken);


router.post("/send-otp", sendRegistrationOTP);
router.post("/verify-otp", verifyRegistration);

router.post("/logout",logout)

router.get("/test-cookies", testCookies);

export default router;
