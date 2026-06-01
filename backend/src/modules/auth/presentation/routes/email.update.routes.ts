import { Router } from "express";
import { emailUpdateController } from "../container/auth.container";
import { authenticate } from "../middlewares/auth.middleware";
import { checkUserActive } from "../../../../shared/middlewares/checkUserActive.middleware";

const router = Router();

router.use(authenticate);
router.use(checkUserActive);

router.post("/email/request-otp", emailUpdateController.requestEmailUpdate);
router.post("/email/verify-otp", emailUpdateController.verifyEmailUpdate);


export default router;
