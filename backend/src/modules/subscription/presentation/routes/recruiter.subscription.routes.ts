import { Router } from "express";
import {
  recruiterPlanDetailController,
  recruiterSubscriptionPlanController,
} from "../container/admin-subscription.module";
import {
  cancelSubscriptionController,
  createPaymentOrderController,
  currentSubscriptionController,
  renewSubscriptionController,
  subscribePlanController,
  upgradeSubscriptionController,
  verifyPaymentController,
} from "../container/recruiter-subscription.module";

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
