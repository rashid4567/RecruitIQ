import { Router } from "express";
import { tokenController } from "../../auth.module";

const router = Router();

router.post("/refresh", tokenController.refresh);

export default router;
