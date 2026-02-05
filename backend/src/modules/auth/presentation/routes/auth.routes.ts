import { Router } from "express";
import { authController, adminAuthcontroller } from "../../auth.module";

const router = Router();

router.post("/login", authController.login);
router.post("/admin/login", adminAuthcontroller.login);
router.post("/logout", authController.logout);

export default router;
