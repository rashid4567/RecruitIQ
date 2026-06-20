import { Router } from "express";
import { googleController } from "../container/auth.container";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();


router.post(AUTH_ROUTES.LOGIN,  googleController.login);

export default router;
