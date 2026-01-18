import {Router} from "express";
import { authenticate } from "../../../../../middlewares/auth.middleware";
import { requireAdmin } from "../../../../../middlewares/role.middleware";
import { emailLogsController } from "../../email-logs.module"; 

const router = Router();
router.use(authenticate, requireAdmin)

router.get("/",emailLogsController.list)
export default router;