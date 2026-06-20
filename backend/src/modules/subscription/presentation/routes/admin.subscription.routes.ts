import { Router } from "express";
import {
  createSubscriptionPlanController,
  getPlanDetailController,
  getSubscribersController,
  getSubscriptionPlanController,
  hideSubscriptionPlanController,
  unhideSubscriptionPlanController,
  updateSubscriptionPlanController,
} from "../container/admin-subscription.module";
import { SUBSCRIPTION_ROUTES } from "../constants/subscription-routes.constants";

const router = Router();

router.post(
  SUBSCRIPTION_ROUTES.ADMIN.PLANS,
  createSubscriptionPlanController.create,
);
router.get(
  SUBSCRIPTION_ROUTES.ADMIN.PLANS,
  getSubscriptionPlanController.getAllPlans,
);
router.get(
  SUBSCRIPTION_ROUTES.ADMIN.PLAN_DETAIL,
  getPlanDetailController.getPlanDetail,
);
router.patch(
  SUBSCRIPTION_ROUTES.ADMIN.PLAN_DETAIL,
  updateSubscriptionPlanController.update,
);
router.patch(
  SUBSCRIPTION_ROUTES.ADMIN.HIDE_PLAN,
  hideSubscriptionPlanController.hide,
);
router.patch(
  SUBSCRIPTION_ROUTES.ADMIN.UNHIDE_PLAN,
  unhideSubscriptionPlanController.unhide,
);
router.get(
  SUBSCRIPTION_ROUTES.ADMIN.SUBSCRIBERS,
  getSubscribersController.getSubscribers,
);
export default router;
