import { Router } from "express";
import { tokenController } from "../container/auth.container";

const router = Router();

router.post("/refresh", tokenController.refresh);

export default router;
