import { Router } from "express";
import { ForgotpasswordController } from "../container/auth.container";

const router = Router();
router.post("/forgot-password", ForgotpasswordController.forgotPassword);
router.post("/reset-password", ForgotpasswordController.resetPassword);


export default router;