import { ApiPaymentRepository } from "../../infrastructure/repositories/ApiPayment.repository";
import { ApiRecruiterSubscriptionRepository } from "../../infrastructure/repositories/ApiRecruiterSubscription.repository";
import { ApiSubscriptionPlanRepository } from "../../infrastructure/repositories/ApiSubscriptionPlan.repository";

import { CancelSubscriptionUseCase } from "../../Application/use-Cases/subscription/CancelSubscriptionUseCase";
import { ChangePlanUseCase } from "../../Application/use-Cases/subscription/ChangePlan.usecase";
import { CreateSubscriptionPaymentUseCase } from "../../Application/use-Cases/subscription/CreateSubscriptionPaymentUseCase";
import { GetAllPlansUseCase } from "../../Application/use-Cases/subscription/GetAllPlansUseCase";
import { GetCurrentSubscriptionUseCase } from "../../Application/use-Cases/subscription/GetCurrentSubscriptionUseCase";
import { GetPlanDetailUseCase } from "../../Application/use-Cases/subscription/GetPlanDetail.usecase";
import { GetSubscriptionHistoryUseCase } from "../../Application/use-Cases/subscription/GetSubscriptionHistory.usecase";
import { RenewSubscriptionUseCase } from "../../Application/use-Cases/subscription/RenewSubscription.usecase";
import { SubscribeUseCase } from "../../Application/use-Cases/subscription/SubscribeUseCase";
import { TrackUsageUseCase } from "../../Application/use-Cases/subscription/TrackUsage.usecase";
import { VerifyPaymentUseCase } from "../../Application/use-Cases/subscription/VerifyPaymentUseCase";

const paymentRepo = new ApiPaymentRepository();
const subscriptionRepo = new ApiRecruiterSubscriptionRepository();
const planRepo = new ApiSubscriptionPlanRepository();
export const createSubscriptionPaymentUC = new CreateSubscriptionPaymentUseCase(
  paymentRepo,
);
export const verifyPaymentUC = new VerifyPaymentUseCase(paymentRepo);
export const getAllPlansUC = new GetAllPlansUseCase(planRepo);
export const getPlanDetailUC = new GetPlanDetailUseCase(planRepo);
export const getCurrentSubscriptionUC = new GetCurrentSubscriptionUseCase(
  subscriptionRepo,
);
export const getSubscriptionHistoryUC = new GetSubscriptionHistoryUseCase(
  subscriptionRepo,
);
export const subscribeUC = new SubscribeUseCase(subscriptionRepo, planRepo);
export const cancelSubscriptionUC = new CancelSubscriptionUseCase(
  subscriptionRepo,
);
export const changePlanUC = new ChangePlanUseCase(subscriptionRepo, planRepo);
export const renewSubscriptionUC = new RenewSubscriptionUseCase(
  subscriptionRepo,
);
export const trackUsageUC = new TrackUsageUseCase(subscriptionRepo);
