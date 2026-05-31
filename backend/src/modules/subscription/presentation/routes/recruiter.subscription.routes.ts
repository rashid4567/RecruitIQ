import { Router } from "express";

import {
  recruiterSubscriptionPlanController,
  recruiterPlanDetailController,
  subscribePlanController,
  renewSubscriptionController,
  cancelSubscriptionController,
  currentSubscriptionController,
  createPaymentOrderController,
  verifyPaymentController,
  upgradeSubscriptionController,
} from "../container/subscription.module";
import { UpgradeSubscriptionController } from "../controller/recruiter/upgrade.subscription.controller";

const router = Router();

router.get("/plans", recruiterSubscriptionPlanController.getAllPlans);
router.get("/plans/:planId", recruiterPlanDetailController.getPlanDetail);
router.post("/subscribe/:planId", subscribePlanController.subscribe);
router.get(
  "/subscriptions/current",
  currentSubscriptionController.getCurrentSubscription,
);
router.patch("/subscription/upgrade", upgradeSubscriptionController.upgrade);
router.post("/payment/order", createPaymentOrderController.create);
router.post("/payment/verify", verifyPaymentController.verify);
router.patch("/renew", renewSubscriptionController.renew);
router.patch("/cancel", cancelSubscriptionController.cancel);
export default router;
