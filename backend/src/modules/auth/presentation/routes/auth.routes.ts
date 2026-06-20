import { Router } from "express";
import {
  authController,
  adminAuthcontroller,
} from "../container/auth.container";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();

router.post(AUTH_ROUTES.LOGIN, authController.login);
router.post(AUTH_ROUTES.ADMIN_LOGIN, adminAuthcontroller.login);
router.post(AUTH_ROUTES.LOGOUT, authController.logout);

export default router;
