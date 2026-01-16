import { Router } from "express";
import { recruiterController } from "../recruiter.module";
import { authenticate } from "../../../middlewares/auth.middleware";
import { checkUserActive } from "../../../middlewares/checkUserActive.middleware";

const router = Router();

router.use(authenticate);
router.use(checkUserActive);

router.get("/profile", recruiterController.getProfile);
router.put("/profile", recruiterController.updateProfile);

router.put("/profile/password", recruiterController.updatePassword);
router.put("/complete-profile", recruiterController.completeProfile);

export default router;
