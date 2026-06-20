import { Router } from "express";
import { emailUpdateController } from "../container/auth.container";
import { authenticate } from "../middlewares/auth.middleware";
import { checkUserActive } from "../../../../shared/middlewares/checkUserActive.middleware";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();

router.use(authenticate);
router.use(checkUserActive);

router.post(AUTH_ROUTES.EMAIL_REQUEST_OTP, emailUpdateController.requestEmailUpdate);
router.post(AUTH_ROUTES.EMAIL_VERIFY_OTP, emailUpdateController.verifyEmailUpdate);


export default router;
