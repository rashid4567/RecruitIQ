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

const router = Router();

router.post("/plans", createSubscriptionPlanController.create);
router.get("/plans", getSubscriptionPlanController.getAllPlans);
router.get("/plans/:planId", getPlanDetailController.getPlanDetail);
router.patch("/plans/:planId", updateSubscriptionPlanController.update);
router.patch("/plans/:planId/hide", hideSubscriptionPlanController.hide);
router.patch("/plans/:planId/unhide", unhideSubscriptionPlanController.unhide);
router.get("/subscribers", getSubscribersController.getSubscribers);
export default router;
