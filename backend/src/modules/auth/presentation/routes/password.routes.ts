import { Router } from "express";
import {
 
  changePassowrdController,
} from "../container/auth.container";
import { authenticate } from "../middlewares/auth.middleware";
import { checkUserActive } from "../../../../middlewares/checkUserActive.middleware";

const router = Router();
router.use(authenticate)
router.use(checkUserActive)
router.put("/update-password", changePassowrdController.updatePassword);

export default router;
