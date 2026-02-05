import { Router } from "express";
import {
  ForgotpasswordController,
  changePassowrdController,
} from "../../auth.module";
import { authenticate } from "../middlewares/auth.middleware";
import { checkUserActive } from "../../../../middlewares/checkUserActive.middleware";

const router = Router();
router.use(authenticate)
router.use(checkUserActive)


router.post("/forgot-password", ForgotpasswordController.forgotPassword);
router.post("/reset-password", ForgotpasswordController.resetPassword);
router.put("/update-password", changePassowrdController.updatePassword);

export default router;
