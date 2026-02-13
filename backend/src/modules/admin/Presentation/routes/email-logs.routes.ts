import { Router } from "express";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { requireAdmin } from "../../../../middlewares/role.middleware";
import { emailLogsController } from "../containers/email-log.container";

const EmailLogrouter = Router();
EmailLogrouter.use(authenticate, requireAdmin);

EmailLogrouter.get("/", emailLogsController.list);
export default EmailLogrouter;
