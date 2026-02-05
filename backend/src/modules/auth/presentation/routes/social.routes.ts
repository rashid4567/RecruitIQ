import { Router } from "express";
import { googleController } from "../../auth.module";

const router = Router();

router.post("/google/login", googleController.login);

export default router;
