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
import { SUBSCRIPTION_ROUTES } from "../constants/subscription-routes.constants";

const router = Router();

router.get(
  SUBSCRIPTION_ROUTES.RECRUITER.PLANS,
  recruiterSubscriptionPlanController.getAllPlans,
);
router.get(
  SUBSCRIPTION_ROUTES.RECRUITER.PLAN_DETAIL,
  recruiterPlanDetailController.getPlanDetail,
);
router.post(
  SUBSCRIPTION_ROUTES.RECRUITER.PLAN_DETAIL,
  subscribePlanController.subscribe,
);
router.get(
  SUBSCRIPTION_ROUTES.RECRUITER.CURRENT_SUBSCRIPTION,
  currentSubscriptionController.getCurrentSubscription,
);
router.patch(
  SUBSCRIPTION_ROUTES.RECRUITER.UPGRADE,
  upgradeSubscriptionController.upgrade,
);
router.post(
  SUBSCRIPTION_ROUTES.RECRUITER.SUBSCRIBE,
  createPaymentOrderController.create,
);
router.post(
  SUBSCRIPTION_ROUTES.RECRUITER.PAYMENT_VERIFY,
  verifyPaymentController.verify,
);
router.patch(
  SUBSCRIPTION_ROUTES.RECRUITER.RENEW,
  renewSubscriptionController.renew,
);
router.patch(
  SUBSCRIPTION_ROUTES.RECRUITER.CANCEL,
  cancelSubscriptionController.cancel,
);
export default router;
