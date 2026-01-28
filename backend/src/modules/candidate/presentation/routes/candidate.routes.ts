import { Router } from "express";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { checkUserActive } from "../../../../middlewares/checkUserActive.middleware";
import { candidateController, getprofileController, updateprofileController } from "../../candidate.module";


const router = Router();
router.use(authenticate)
router.use(checkUserActive)


router.get("/profile",getprofileController.getProfile);
router.put("/profile",updateprofileController.updateProfile);
router.put("/profile/complete",candidateController.completeProfile);
// router.put("/password",candidateController.updatePassword)
// router.put("email/request-otp",candidateController.requestEmailUpdate);
// router.post("/email/verify",candidateController.verifyEmailUpdate)

export default router;