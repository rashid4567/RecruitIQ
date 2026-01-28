import { Router } from "express";

import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { requireAdmin } from "../../../../middlewares/role.middleware";
import { emailTemplateController } from "../email.template.module";

const router = Router();
router.use(authenticate, requireAdmin)

router.post("/",emailTemplateController.create)
router.get("/", emailTemplateController.list);
router.put("/:id",emailTemplateController.update),
router.patch("/:id/toggle",emailTemplateController.toggle)
router.post("/:id/test",emailTemplateController.sentTest)
router.delete("/:id",emailTemplateController.delete)
export default router;