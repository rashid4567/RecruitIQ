import { Router } from "express";
import userManagementRouter from "./user-management.routes";
import candidateMangmentRouter from "./candidate-management.routes";
import recruiterManagementRouter from "./recruiter-management.routes";
import EmailTemplaterouter from "../../../email/presentation/router/email-template.routes";
import EmailLogrouter from "../../../email/presentation/router/email-logs.routes"
import ActivityLogRouter from "../../../Activity.logger/presentation/router/activity-log.routes"
import JobPostRouter from "../../../job/presentation/router/admin.jobPost.routes";
import SubscriptionPlanRouter from "../../../subscription/presentation/routes/admin.subscription.routes"
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { requireAdmin } from "../../../../shared/middlewares/role.middleware";

const adminRoutes = Router();
adminRoutes.use(authenticate, requireAdmin);

adminRoutes.use("/", userManagementRouter);
adminRoutes.use("/candidates", candidateMangmentRouter);
adminRoutes.use("/recruiters", recruiterManagementRouter);
adminRoutes.use("/email-templates", EmailTemplaterouter);
adminRoutes.use("/email-logs", EmailLogrouter);
adminRoutes.use("/activity-logs", ActivityLogRouter);
adminRoutes.use("/jobs", JobPostRouter);
adminRoutes.use("/", SubscriptionPlanRouter);

export default adminRoutes;
