import { Router } from "express";
import {
  getAllPlansController,
  getPlanDetailController,
  cancelSubscriptionController,
  changePlanController,
  getCurrentSubscriptionController,
  getSubscriptionHistoryController,
  renewSubscriptionController,
  subscribeController,
  trackUsageController,
  getBillingHistoryController,
  getTotalSpendController,
  getBillingRecordDetailController,
  recordPaymentController,
  recordFailedPaymentController,
  updateBillingStatusController,
} from "../../subscription.module";

const router = Router();

router.get("/", getAllPlansController.getActivePlans);
router.get("/:planId", getPlanDetailController.getPlanDetail);
router.post("/subscribe", subscribeController.subscribe);
router.get("/current", getCurrentSubscriptionController.getCurrentSubscription);

//router.get("/history", getSubscriptionHistoryController.getSubscriptionHistory);
router.post("/cancel", cancelSubscriptionController.cancelSubscription);
router.post("/change-plan", changePlanController.changePlan);
router.post("/renew", renewSubscriptionController.renewSubscription);
router.patch("/usage", trackUsageController.trackUsage);
router.get("/billing/history", getBillingHistoryController.getBillingHistory);
router.get("/billing/total-spend", getTotalSpendController.getTotalSpend);
router.get("/billing/:billingRecordId", getBillingRecordDetailController.getBillingRecordDetail);
router.post("/billing/record-payment", recordPaymentController.recordPayment);
router.post("/billing/record-failed-payment", recordFailedPaymentController.recordFailedPayment);
router.patch("/billing/:billingRecordId/status", updateBillingStatusController.updateBillingStatus);
export default router;
