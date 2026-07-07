import { Router } from "express";
import userManagementRouter from "./user-management.routes";
import candidateMangmentRouter from "./candidate-management.routes";
import recruiterManagementRouter from "./recruiter-management.routes";
import EmailTemplaterouter from "../../../email/presentation/router/email-template.routes";
import EmailLogrouter from "../../../email/presentation/router/email-logs.routes";
import ActivityLogRouter from "../../../Activity.logger/presentation/router/activity-log.routes";
import JobPostRouter from "../../../job/presentation/router/admin.jobPost.routes";
import SubscriptionPlanRouter from "../../../subscription/presentation/routes/admin.subscription.routes";
import AdminDashboardRouter from "../../../dashboard/presentation/router/admin.routes";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { requireAdmin } from "../../../../shared/middlewares/role.middleware";
import { ADMIN_ROUTES } from "../constants/admin-routes.constants";

const adminRoutes = Router();
adminRoutes.use(authenticate, requireAdmin);

adminRoutes.use("/", userManagementRouter);
adminRoutes.use(ADMIN_ROUTES.CANDIDATES, candidateMangmentRouter);
adminRoutes.use(ADMIN_ROUTES.RECRUITERS, recruiterManagementRouter);
adminRoutes.use(ADMIN_ROUTES.EMAIL_TEMPLATES, EmailTemplaterouter);
adminRoutes.use(ADMIN_ROUTES.EMAIL_LOGS, EmailLogrouter);
adminRoutes.use(ADMIN_ROUTES.ACTIVITY_LOGS, ActivityLogRouter);
adminRoutes.use(ADMIN_ROUTES.JOBS, JobPostRouter);
adminRoutes.use(ADMIN_ROUTES.DASHBOARD, AdminDashboardRouter);
adminRoutes.use("/", SubscriptionPlanRouter);
export default adminRoutes;
