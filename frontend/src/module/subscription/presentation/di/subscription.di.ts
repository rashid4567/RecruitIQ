import { ApiPaymentRepository } from "../../../recruiter/infrastructure/repositories/ApiPayment.repository";
import { ApiRecruiterSubscriptionRepository } from "@/module/subscription/infrastructure/repositories/ApiRecruiterSubscription.repository";
import { ApiSubscriptionPlanRepository } from "../../infrastructure/repositories/ApiSubscriptionPlan.repository";

import { CancelSubscriptionUseCase } from "../../application/usecase/subscription/CancelSubscriptionUseCase";
//import { ChangePlanUseCase } from "../../application/usecase/subscription/ChangePlan.usecase";
import { CreateSubscriptionPaymentUseCase } from "../../application/usecase/subscription/CreateSubscriptionPaymentUseCase";
import { GetAllPlansUseCase } from "../../application/usecase/subscription/GetAllPlansUseCase";
import { GetCurrentSubscriptionUseCase } from "../../application/usecase/subscription/GetCurrentSubscriptionUseCase";
import { GetPlanDetailUseCase } from "../../application/usecase/subscription/GetPlanDetail.usecase";
import { GetSubscriptionHistoryUseCase } from "../../application/usecase/subscription/GetSubscriptionHistory.usecase";
import { RenewSubscriptionUseCase } from "../../application/usecase/subscription/RenewSubscription.usecase";
import { SubscribeUseCase } from "../../application/usecase/subscription/SubscribeUseCase";
import { TrackUsageUseCase } from "../../application/usecase/subscription/TrackUsage.usecase";
import { VerifyPaymentUseCase } from "../../application/usecase/subscription/VerifyPaymentUseCase";

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
//export const changePlanUC = new ChangePlanUseCase(subscriptionRepo, planRepo);
export const renewSubscriptionUC = new RenewSubscriptionUseCase(
  subscriptionRepo,
);
export const trackUsageUC = new TrackUsageUseCase(subscriptionRepo);
