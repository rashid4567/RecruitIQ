import { Router } from "express";

import {
  createSubscriptionPlanController,
  updateSubscriptionPlanController,
  getSubscriptionPlanController,
  getPlanDetailController,
  hideSubscriptionPlanController,
  unhideSubscriptionPlanController,
} from "../container/subscription.module";

const router = Router();

router.post("/plans", createSubscriptionPlanController.create);
router.get("/plans", getSubscriptionPlanController.getAllPlans);
router.get("/plans/:planId", getPlanDetailController.getPlanDetail);
router.patch("/plans/:planId", updateSubscriptionPlanController.update);
router.patch("/plans/:planId/hide", hideSubscriptionPlanController.hide);
router.patch("/plans/:planId/unhide", unhideSubscriptionPlanController.unhide);

export default router;
