import { Router } from "express";
import userManagementRouter from "./user-management.routes";
import candidateMangmentRouter from "./candidate-management.routes";
import recruiterManagementRouter from "./recruiter-management.routes";
import EmailTemplaterouter from "./email-template.routes";
import EmailLogrouter from "./email-logs.routes";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { requireAdmin } from "../../../../middlewares/role.middleware";

const adminRoutes = Router();
adminRoutes.use(authenticate, requireAdmin);

adminRoutes.use("/", userManagementRouter);
adminRoutes.use("/candidates", candidateMangmentRouter);
adminRoutes.use("/recruiters", recruiterManagementRouter);
adminRoutes.use("/email-templates", EmailTemplaterouter);
adminRoutes.use("/email-logs", EmailLogrouter);

export default adminRoutes;
