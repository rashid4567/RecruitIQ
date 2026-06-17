import { RAZORPAY_KEY_ID } from "../../../../config/razorpay";
import { SubscribePlanUseCase } from "../../application/usecase/Recruiter/subscribe-plan.usecase";
import { RenewSubscriptionUseCase } from "../../application/usecase/Recruiter/RenewSubscriptionUseCase";
import { CancelSubscriptionUseCase } from "../../application/usecase/Recruiter/CancelSubscriptionUseCase";
import { GetCurrentSubscriptionUseCase } from "../../application/usecase/Recruiter/GetCurrentSubscriptionUseCase";
import { UpgradeSubscriptionUseCase } from "../../application/usecase/Recruiter/UpgradeSubscriptionUseCase";
import { CreatePaymentOrderUseCase } from "../../application/usecase/Recruiter/CreatePaymentOrderUseCase";
import { VerifyPaymentUseCase } from "../../application/usecase/Recruiter/VerifyPaymentUseCase";
import { RecruiterSubscriptionRepository } from "../../domain/repository/recruiter-subscription-plan-repository";
import { SubscriptionPlanRepository } from "../../domain/repository/subscription-plan.repository";
import { PaymentRepository } from "../../domain/repository/payment.repository";
import { MongooseRecruiterSubscriptionRepository } from "../../infrastructure/repositories/mongoose-recruiter-subscription.repository";
import { MongooseSubscriptionPlanRepository } from "../../infrastructure/repositories/mongoose-subscription-plan.repository";
import { MongoosePaymentRepository } from "../../infrastructure/repositories/mongoose-payment-repository";
import { RazorpayGateway } from "../../infrastructure/payment/razorpay.gateway";
import { SubscribePlanController } from "../controller/recruiter/subscribe-plan.controller";
import { RenewSubscriptionController } from "../controller/recruiter/renew-subscription.controller";
import { CancelSubscriptionController } from "../controller/recruiter/cancel-subscription.controller";
import { GetCurrentSubsriptionController } from "../controller/recruiter/getCurrentSubscription.controller";
import { CreatePaymentOrderController } from "../controller/recruiter/CreatePaymentOrder.controller";
import { VerifyPaymentController } from "../controller/recruiter/verifyPayment.controller";
import { UpgradeSubscriptionController } from "../controller/recruiter/upgrade.subscription.controller";
import { UpdateRecruiterSubscriptionStatusUseCase } from "../../../recruiter/application/useCase/profile/UpdateRecruiterSubscriptionStatusUseCase";
import { MongooseRecruiterProfileRepository } from "../../../recruiter/infrastructure/repositories/mongoose-recruiter.repository";
import { UUIDGenerator } from "../../infrastructure/service/uuid-generator.service";
import { createNotificationUC } from "../../../notification/presentation/container/notification.module";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { MongooseJobApplicationRepository } from "../../../job-application/infrastructure/repository/MongooseJobApplicationRepository";
import { AnalyzeApplicationUC } from "../../../job-application/presenatation/container/JobApplication.module";

const subscriptionRepo: SubscriptionPlanRepository =
  new MongooseSubscriptionPlanRepository();
const recruiterSubscriptionRepo: RecruiterSubscriptionRepository =
  new MongooseRecruiterSubscriptionRepository();
const paymentRepo: PaymentRepository = new MongoosePaymentRepository();
const paymentGateway = new RazorpayGateway();
export const applicationRepo: JobApplicationRepository =
  new MongooseJobApplicationRepository();
const recruiterProfileRepo = new MongooseRecruiterProfileRepository();
const updateRecruiterSubscriptionStatusUC =
  new UpdateRecruiterSubscriptionStatusUseCase(recruiterProfileRepo);
const subscribeUC = new SubscribePlanUseCase(
  subscriptionRepo,
  recruiterSubscriptionRepo,
);
const idGenerator = new UUIDGenerator();
const renewUC = new RenewSubscriptionUseCase(
  recruiterSubscriptionRepo,
  subscriptionRepo,
);
const cancelUC = new CancelSubscriptionUseCase(recruiterSubscriptionRepo);
const currentSubscriptionUC = new GetCurrentSubscriptionUseCase(
  recruiterSubscriptionRepo,
  updateRecruiterSubscriptionStatusUC,
);
const upgaradeSubscriptionUC = new UpgradeSubscriptionUseCase(
  subscriptionRepo,
  recruiterSubscriptionRepo,
  applicationRepo,
  AnalyzeApplicationUC,
);
const createPaymentOrderUC = new CreatePaymentOrderUseCase(
  paymentRepo,
  recruiterSubscriptionRepo,
  subscriptionRepo,
  paymentGateway,
  idGenerator,
  RAZORPAY_KEY_ID,
);
const verifyPaymentUC = new VerifyPaymentUseCase(
  paymentRepo,
  subscriptionRepo,
  recruiterSubscriptionRepo,
  paymentGateway,
  upgaradeSubscriptionUC,
  updateRecruiterSubscriptionStatusUC,
  createNotificationUC,
);
export const subscribePlanController = new SubscribePlanController(subscribeUC);
export const renewSubscriptionController = new RenewSubscriptionController(
  renewUC,
);
export const cancelSubscriptionController = new CancelSubscriptionController(
  cancelUC,
);
export const currentSubscriptionController =
  new GetCurrentSubsriptionController(currentSubscriptionUC);
export const createPaymentOrderController = new CreatePaymentOrderController(
  createPaymentOrderUC,
);
export const verifyPaymentController = new VerifyPaymentController(
  verifyPaymentUC,
);
export const upgradeSubscriptionController = new UpgradeSubscriptionController(
  upgaradeSubscriptionUC,
);
