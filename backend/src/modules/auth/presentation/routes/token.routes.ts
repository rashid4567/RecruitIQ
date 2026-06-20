import { Router } from "express";
import { tokenController } from "../container/auth.container";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();

router.post(AUTH_ROUTES.REFRESH, tokenController.refresh);

export default router;
