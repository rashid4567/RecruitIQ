import { Router } from "express";
import {
  adminDashboardController,
  recruiterDashbordController,
} from "../container/dashboard.module";
import { DASHBOARD_ROUTES } from "../constant/dashboard.router";

const router = Router();

router.get(
  DASHBOARD_ROUTES.RECRUITER_DASHBOARD,
  recruiterDashbordController.recruiterDashboard,
);
router.get(
  DASHBOARD_ROUTES.ADMIN_DASHBOARD,
  adminDashboardController.adminDashboard,
);

export default router;
