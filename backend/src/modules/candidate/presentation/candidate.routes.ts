import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { checkUserActive } from "../../../middlewares/checkUserActive.middleware";
import { candidateController } from "../candidate.module";


const router = Router();
router.use(authenticate)
router.use(checkUserActive)


router.get("/profile",candidateController.getProfile);
router.put("/profile",candidateController.updateProfile);
router.put("/profile/complete",candidateController.completeProfile);
router.put("/password",candidateController.updtePassword)

export default router;