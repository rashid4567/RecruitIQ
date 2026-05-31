import { ApiPaymentRepository } from "../../infrastructure/repositories/ApiPayment.repository";
import { ApiRecruiterSubscriptionRepository } from "@/module/subscription/infrastructure/repositories/ApiRecruiterSubscription.repository";
import { ApiSubscriptionPlanRepository } from "../../infrastructure/repositories/ApiSubscriptionPlan.repository";
import { CancelSubscriptionUseCase } from "../../application/usecase/subscription/recruiter/CancelSubscriptionUseCase";
import { CreatePaymentUseCase } from "../../application/usecase/subscription/recruiter/CreatePaymentUseCase";
import { GetAllPlansUseCase } from "../../application/usecase/subscription/recruiter/GetAllPlansUseCase";
import { GetCurrentSubscriptionUseCase } from "../../application/usecase/subscription/recruiter/GetCurrentSubscriptionUseCase";
import { GetPlanDetailUseCase } from "../../application/usecase/subscription/recruiter/GetPlanDetail.usecase";
import { GetSubscriptionHistoryUseCase } from "../../application/usecase/subscription/recruiter/GetSubscriptionHistory.usecase";
import { RenewSubscriptionUseCase } from "../../application/usecase/subscription/recruiter/RenewSubscription.usecase";
import { VerifyPaymentUseCase } from "../../application/usecase/subscription/recruiter/VerifyPaymentUseCase";
import { UpgradeSubscriptionUseCase } from "../../application/usecase/subscription/recruiter/upgrade.subscription.usecase";

const paymentRepo = new ApiPaymentRepository();
const subscriptionRepo = new ApiRecruiterSubscriptionRepository();
const planRepo = new ApiSubscriptionPlanRepository();
export const createSubscriptionPaymentUC = new CreatePaymentUseCase(
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
export const cancelSubscriptionUC = new CancelSubscriptionUseCase(
  subscriptionRepo,
);
export const renewSubscriptionUC = new RenewSubscriptionUseCase(
  subscriptionRepo,
);
export const upgradeSubscriptionUC = new UpgradeSubscriptionUseCase(
  subscriptionRepo,
);
