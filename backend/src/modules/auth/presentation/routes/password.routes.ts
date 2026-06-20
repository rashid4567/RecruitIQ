import { Router } from "express";
import { changePassowrdController } from "../container/auth.container";
import { authenticate } from "../middlewares/auth.middleware";
import { checkUserActive } from "../../../../shared/middlewares/checkUserActive.middleware";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();
router.use(authenticate);
router.use(checkUserActive);
router.put(
  AUTH_ROUTES.UPDATE_PASSWORD,
  changePassowrdController.updatePassword,
);

export default router;
