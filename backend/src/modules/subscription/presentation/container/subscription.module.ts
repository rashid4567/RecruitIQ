import { RAZORPAY_KEY_ID } from "../../../../config/razorpay";
import { ActiveSubscriptionPlanUseCase } from "../../application/usecase/Admin/activate-subscription-plan.usecase";
import { CreateSubscriptionPlanUseCase } from "../../application/usecase/Admin/create-subscription-plan.usecase";
import { DeactivateSubscriptionPlanUseCase } from "../../application/usecase/Admin/deactivate-subscription-plan.usecase";
import { GetAllSubscriptionPlansUseCase } from "../../application/usecase/Admin/get-all-subscription-plans.usecase";
import { GetSubscriptionPlanUseCase } from "../../application/usecase/Admin/get-subscription-plan.usecase";
import { UpdateSubscriptionPlanUseCase } from "../../application/usecase/Admin/update-subscription-plan.usecase";
import { CancelSubscriptionUseCase } from "../../application/usecase/Recruiter/CancelSubscriptionUseCase";
import { CreatePaymentOrderUseCase } from "../../application/usecase/Recruiter/CreatePaymentOrderUseCase";
import { GetCurrentSubscriptionUseCase } from "../../application/usecase/Recruiter/GetCurrentSubscriptionUseCase";
import { RenewSubscriptionUseCase } from "../../application/usecase/Recruiter/RenewSubscriptionUseCase";
import { SubscribePlanUseCase } from "../../application/usecase/Recruiter/subscribe-plan.usecase";
import { VerifyPaymentUseCase } from "../../application/usecase/Recruiter/VerifyPaymentUseCase";
import { RecruiterSubscriptionRepository } from "../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../domain/repository/subscription-plan.repository";
import { PaymentRepository } from "../../domain/repository/payment.repository";
import { MongooseRecruiterSubscriptionRepository } from "../../infrastructure/repositories/mongoose-recruiter-subscription.repository";
import { MongooseSubscriptionPlanRepository } from "../../infrastructure/repositories/mongoose-subscription-plan.repository";
import { MongoosePaymentRepository } from "../../infrastructure/repositories/mongoose-payment-repository";
import { RazorpayGateway } from "../../../recruiter/infrastructure/payment/razorpay.gateway";
import { CreateSubscriptionPlanController } from "../controller/admin/create-subscription-plan.controller";
import { GetSubscriptionPlanController } from "../controller/admin/get-subscription-plan.controller";
import { HideSubscriptionPlanController } from "../controller/admin/hide-subscription-plan.controller";
import { UnhideSubscriptionPlanController } from "../controller/admin/unhide-subscription-plan.controller";
import { UpdateSubscriptionPlanController } from "../controller/admin/update-subscription-plan.controller";
import { CancelSubscriptionController } from "../controller/recruiter/cancel-subscription.controller";
import { CurrentSubscriptionController } from "../controller/recruiter/current-subscription.controller";
import { GetPlanDetailController } from "../controller/recruiter/get-plan-detail.controller";
import { RecruiterPlanDetailController } from "../controller/recruiter/get.plans.controller";
import { RenewSubscriptionController } from "../controller/recruiter/renew-subscription.controller";
import { SubscribePlanController } from "../controller/recruiter/subscribe-plan.controller";
import { CreatePaymentOrderController } from "../controller/recruiter/CreatePaymentOrder.controller";
import { VerifyPaymentController } from "../controller/recruiter/verifyPayment.controller";

const subscriptionRepo: SubscriptionPlanRepository =
  new MongooseSubscriptionPlanRepository();

const recruiterSubscriptionRepo: RecruiterSubscriptionRepository =
  new MongooseRecruiterSubscriptionRepository();

const paymentRepo: PaymentRepository = new MongoosePaymentRepository();

const paymentGateway = new RazorpayGateway();

const createPlanUC = new CreateSubscriptionPlanUseCase(subscriptionRepo);

const updatePlanUC = new UpdateSubscriptionPlanUseCase(subscriptionRepo);

const getPlansUC = new GetAllSubscriptionPlansUseCase(subscriptionRepo);

const getPlanUC = new GetSubscriptionPlanUseCase(subscriptionRepo);

const activatePlanUC = new ActiveSubscriptionPlanUseCase(subscriptionRepo);

const deactivatePlanUC = new DeactivateSubscriptionPlanUseCase(
  subscriptionRepo,
);

const subscribeUC = new SubscribePlanUseCase(
  subscriptionRepo,
  recruiterSubscriptionRepo,
);

const renewUC = new RenewSubscriptionUseCase(
  recruiterSubscriptionRepo,
  subscriptionRepo,
);

const cancelUC = new CancelSubscriptionUseCase(recruiterSubscriptionRepo);

const currentSubscriptionUC = new GetCurrentSubscriptionUseCase(
  recruiterSubscriptionRepo,
);

const createPaymentOrderUC = new CreatePaymentOrderUseCase(
  paymentRepo,
  recruiterSubscriptionRepo,
  subscriptionRepo,
  paymentGateway,
  RAZORPAY_KEY_ID,
);

const verifyPaymentUC = new VerifyPaymentUseCase(
  paymentRepo,
  subscriptionRepo,
  recruiterSubscriptionRepo,
  paymentGateway,
);

export const createSubscriptionPlanController =
  new CreateSubscriptionPlanController(createPlanUC);

export const updateSubscriptionPlanController =
  new UpdateSubscriptionPlanController(updatePlanUC);

export const getSubscriptionPlanController = new GetSubscriptionPlanController(
  getPlansUC,
);

export const getPlanDetailController = new GetPlanDetailController(getPlanUC);

export const hideSubscriptionPlanController =
  new HideSubscriptionPlanController(deactivatePlanUC);

export const unhideSubscriptionPlanController =
  new UnhideSubscriptionPlanController(activatePlanUC);

export const recruiterSubscriptionPlanController =
  new RecruiterPlanDetailController(getPlansUC);

export const recruiterPlanDetailController = new GetPlanDetailController(
  getPlanUC,
);

export const subscribePlanController = new SubscribePlanController(subscribeUC);

export const renewSubscriptionController = new RenewSubscriptionController(
  renewUC,
);

export const cancelSubscriptionController = new CancelSubscriptionController(
  cancelUC,
);

export const currentSubscriptionController = new CurrentSubscriptionController(
  currentSubscriptionUC,
);

export const createPaymentOrderController = new CreatePaymentOrderController(
  createPaymentOrderUC,
);

export const verifyPaymentController = new VerifyPaymentController(
  verifyPaymentUC,
);
