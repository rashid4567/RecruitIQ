import { Router } from "express";

import {
  recruiterSubscriptionPlanController,
  recruiterPlanDetailController,
  subscribePlanController,
  renewSubscriptionController,
  cancelSubscriptionController,
  currentSubscriptionController,
} from "../container/subscription.module";

const router = Router();

router.get("/plans", recruiterSubscriptionPlanController.getAllPlans);
router.get("/plans/:planId", recruiterPlanDetailController.getPlanDetail);
router.post("/subscribe/:planId", subscribePlanController.subscribe);
router.patch("/renew", renewSubscriptionController.renew);
router.patch("/cancel", cancelSubscriptionController.cancel);
router.get("/current", currentSubscriptionController.current);

export default router;
