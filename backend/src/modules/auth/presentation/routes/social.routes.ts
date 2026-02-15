import { Router } from "express";
import { googleController } from "../container/auth.container";

const router = Router();


router.post("/login",  googleController.login);

export default router;
