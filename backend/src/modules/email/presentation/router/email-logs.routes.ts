import { Router } from "express";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { requireAdmin } from "../../../../shared/middlewares/role.middleware";
import { emailLogsController } from "../../../email/presentation/container/email-log.container";
import { EMAIL_ROUTES } from "../constants/email-routes.constant";

const EmailLogrouter = Router();
EmailLogrouter.use(authenticate, requireAdmin);

EmailLogrouter.get(EMAIL_ROUTES.ROOT, emailLogsController.list);
export default EmailLogrouter;
