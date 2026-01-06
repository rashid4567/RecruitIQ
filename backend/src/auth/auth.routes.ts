import { Router } from "express"
import {
    login, 
    refreshToken, 
    register, 
    sendRegistrationOTP, 
    verifyCandidateRegistration,
    testCookies  // Add this import
} from "./auth.controller"

const router = Router();

router.post("/recruiter/register", register);
router.post("/login", login);

router.post("/candidate/send-otp", sendRegistrationOTP);
router.post("/candidate/register", verifyCandidateRegistration);

router.post("/refresh", refreshToken);
router.get("/test-cookies", testCookies); // Add this line

export default router;