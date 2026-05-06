import { Router } from "express";
import {
  createSubscriptionController,
  verifyPaymentController,
  getAllPlansController,
  getPlanDetailController,
  cancelSubscriptionController,
  changePlanController,
  getCurrentSubscriptionController,
  renewSubscriptionController,
  trackUsageController,
  getBillingHistoryController,
  getTotalSpendController,
  getBillingRecordDetailController,
  recordPaymentController,
  recordFailedPaymentController,
  updateBillingStatusController,
} from "../../subscription.module";

const router = Router();

// Plans
router.get("/plans",         getAllPlansController.getActivePlans);
router.get("/plans/:planId", getPlanDetailController.getPlanDetail);

// Payment — just these two, no webhook
router.post("/payment/create-subscription", createSubscriptionController.createSubscription);
router.post("/payment/verify",              verifyPaymentController.verifyPayment);

// Subscriptions
router.get( "/subscriptions/current",      getCurrentSubscriptionController.getCurrentSubscription);
router.post("/subscriptions/cancel",       cancelSubscriptionController.cancelSubscription);
router.post("/subscriptions/change-plan",  changePlanController.changePlan);
router.post("/subscriptions/renew",        renewSubscriptionController.renewSubscription);
router.patch("/subscriptions/usage",       trackUsageController.trackUsage);

// Billing
router.get( "/billing/history",                 getBillingHistoryController.getBillingHistory);
router.get( "/billing/total-spend",             getTotalSpendController.getTotalSpend);
router.get( "/billing/:billingRecordId",         getBillingRecordDetailController.getBillingRecordDetail);
router.post("/billing/record-payment",           recordPaymentController.recordPayment);
router.post("/billing/record-failed-payment",    recordFailedPaymentController.recordFailedPayment);
router.patch("/billing/:billingRecordId/status", updateBillingStatusController.updateBillingStatus);

export default router;