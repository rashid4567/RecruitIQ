// import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "../../../../config/razorpay";
// import { CancelSubscriptionUseCase } from "../../application/useCase/subscription.plans/Cancelsubscription.usecase";
// import { ChangePlanUseCase } from "../../application/useCase/subscription.plans/Changeplan.usecase";
// import { CreateOrderUseCase } from "../../application/useCase/subscription.plans/Createorder.usecase";
// import { GetAllPlansUseCase } from "../../application/useCase/subscription.plans/Getallplans.usecase";
// import { GetBillingHistoryUseCase } from "../../application/useCase/subscription.plans/Getbillinghistory.usecase";
// import { GetBillingRecordDetailUseCase } from "../../application/useCase/subscription.plans/Getbillingrecorddetail.usecase";
// import { GetCurrentSubscriptionUseCase } from "../../application/useCase/subscription.plans/Getcurrentsubscription.usecase";
// import { GetPlanDetailUseCase } from "../../application/useCase/subscription.plans/Getplandetails.usecase";
// import { GetSubscriptionHistoryUseCase } from "../../application/useCase/subscription.plans/Getsubscriptionhistory.usecase";
// import { GetTotalSpendUseCase } from "../../application/useCase/subscription.plans/Gettotalspend.usecase ";
// import { RecordFailedPaymentUseCase } from "../../application/useCase/subscription.plans/Recordfailedpayment.usecase";
// import { RecordPaymentUseCase } from "../../application/useCase/subscription.plans/Recordpayment.usecase";
// import { RenewSubscriptionUseCase } from "../../application/useCase/subscription.plans/Renewsubscription.usecase";
// import { SubscribeUseCase } from "../../application/useCase/subscription.plans/Subscribe.usecase";
// import { TrackUsageUseCase } from "../../application/useCase/subscription.plans/Trackusage.usecase";
// import { UpdateBillingStatusUseCase } from "../../application/useCase/subscription.plans/Updatebillingstatus.usecase";
// import { VerifyPaymentUseCase } from "../../application/useCase/subscription.plans/VerifyPayment.usecase";
// import { BillingRecordRepository } from "../../domain/repositories/billing.repository";
// import { RecruiterSubscriptionRepository } from "../../domain/repositories/recruiter-subscription.repository";
// import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
// import { SubscriptionPlanRepository } from "../../domain/repositories/Subscription.repository";
// import { RazorpayGateway } from "../../infrastructure/payment/razorpay.gateway";
// import { MongooseRecruiterProfileRepository } from "../../infrastructure/repositories/mongoose-recruiter.repository";
// import { MongooseBillingRecordRepository } from "../../infrastructure/repositories/Mongoosebillingrecord.repository";
// import { MongooseRecruiterSubscriptionRepository } from "../../infrastructure/repositories/Mongooserecruitersubscription.repository";
// import { MongooseSubscriptionPlanRepository } from "../../infrastructure/repositories/Mongoosesubscriptionplan.repository";
// import { CancelSubscriptionController } from "../../presentation/controller/Subscriptionplan/CancelSubscription.controller";
// import { ChangePlanController } from "../../presentation/controller/Subscriptionplan/ChangePlan.controller";
// import { CreateSubscriptionController } from "../../presentation/controller/Subscriptionplan/CreateSubscription.controller";
// import { GetAllPlansController } from "../../presentation/controller/Subscriptionplan/GetAllplans.controller";
// import { GetBillingHistoryController } from "../../presentation/controller/Subscriptionplan/Getbillinghistory.controller";
// import { GetBillingRecordDetailController } from "../../presentation/controller/Subscriptionplan/Getbillingrecorddetail.controller";
// import { GetCurrentSubscriptionController } from "../../presentation/controller/Subscriptionplan/GetCurrentSubscription.controller";
// import { GetPlanDetailController } from "../../presentation/controller/Subscriptionplan/Getplandetail.controller";
// import { GetSubscriptionHistoryController } from "../../presentation/controller/Subscriptionplan/GetSubscriptionHistory.controller";
// import { GetTotalSpendController } from "../../presentation/controller/Subscriptionplan/Gettotalspend.controller";
// import { RecordFailedPaymentController } from "../../presentation/controller/Subscriptionplan/Recordfailedpayment.controller";
// import { RecordPaymentController } from "../../presentation/controller/Subscriptionplan/Recordpayment.controller";
// import { RenewSubscriptionController } from "../../presentation/controller/Subscriptionplan/RenewSubscription.controller";
// import { SubscribeController } from "../../presentation/controller/Subscriptionplan/Subscribe.controller";
// import { TrackUsageController } from "../../presentation/controller/Subscriptionplan/TrackUsage.controller";
// import { UpdateBillingStatusController } from "../../presentation/controller/Subscriptionplan/Updatebillingstatus.controller";
// import { VerifyPaymentController } from "../../presentation/controller/Subscriptionplan/VerifyPayment.controller";

// const subscriptionRepo: SubscriptionPlanRepository =
//   new MongooseSubscriptionPlanRepository();
// const recruiterSubscriptionRepo: RecruiterSubscriptionRepository =
//   new MongooseRecruiterSubscriptionRepository();
// const billingRecordRepo: BillingRecordRepository =
//   new MongooseBillingRecordRepository();
// const RecruiterRepo: RecruiterProfileRepository =
//   new MongooseRecruiterProfileRepository();
// const paymentGateway = new RazorpayGateway();
// const getAllPlansUC = new GetAllPlansUseCase(subscriptionRepo);
// const getDetailsUC = new GetPlanDetailUseCase(subscriptionRepo);
// const cancelSubscriptionUC = new CancelSubscriptionUseCase(
//   recruiterSubscriptionRepo,
//   RecruiterRepo,
// );
// const changePlanUC = new ChangePlanUseCase(
//   recruiterSubscriptionRepo,
//   subscriptionRepo,
// );
// const getCurrentSubscriptionUC = new GetCurrentSubscriptionUseCase(
//   recruiterSubscriptionRepo,
//   RecruiterRepo,
// );
// const getSubscriptionHistoryUC = new GetSubscriptionHistoryUseCase(
//   recruiterSubscriptionRepo,
// );
// const renewSubscriptionUC = new RenewSubscriptionUseCase(
//   recruiterSubscriptionRepo,
//   RecruiterRepo,
// );
// const subscribeUC = new SubscribeUseCase(
//   recruiterSubscriptionRepo,
//   subscriptionRepo,
// );
// const trackUsageUC = new TrackUsageUseCase(recruiterSubscriptionRepo);
// const getBillingUC = new GetBillingHistoryUseCase(billingRecordRepo);
// const getBillingRecordUC = new GetBillingRecordDetailUseCase(billingRecordRepo);
// const recordPaymentUC = new RecordPaymentUseCase(billingRecordRepo);
// const recordPaymentFailedUC = new RecordFailedPaymentUseCase(billingRecordRepo);
// const updateBillingUC = new UpdateBillingStatusUseCase(billingRecordRepo);
// const getTotalSpendUC = new GetTotalSpendUseCase(billingRecordRepo);
// const createOrderUC = new CreateOrderUseCase(
//   recruiterSubscriptionRepo,
//   subscriptionRepo,
//   paymentGateway,
//   RAZORPAY_KEY_ID,
// );
// const verifyPaymentUC = new VerifyPaymentUseCase(
//   recruiterSubscriptionRepo,
//   billingRecordRepo,
//   RecruiterRepo,
//   RAZORPAY_KEY_SECRET,
// );
// export const getAllPlansController = new GetAllPlansController(getAllPlansUC);
// export const getPlanDetailController = new GetPlanDetailController(
//   getDetailsUC,
// );
// export const cancelSubscriptionController = new CancelSubscriptionController(
//   cancelSubscriptionUC,
// );
// export const changePlanController = new ChangePlanController(changePlanUC);
// export const getCurrentSubscriptionController =
//   new GetCurrentSubscriptionController(getCurrentSubscriptionUC);
// export const getSubscriptionHistoryController =
//   new GetSubscriptionHistoryController(getSubscriptionHistoryUC);
// export const renewSubscriptionController = new RenewSubscriptionController(
//   renewSubscriptionUC,
// );
// export const subscribeController = new SubscribeController(subscribeUC);
// export const trackUsageController = new TrackUsageController(trackUsageUC);
// export const getBillingHistoryController = new GetBillingHistoryController(
//   getBillingUC,
// );
// export const getBillingRecordDetailController =
//   new GetBillingRecordDetailController(getBillingRecordUC);
// export const getTotalSpendController = new GetTotalSpendController(
//   getTotalSpendUC,
// );
// export const recordPaymentController = new RecordPaymentController(
//   recordPaymentUC,
// );
// export const recordFailedPaymentController = new RecordFailedPaymentController(
//   recordPaymentFailedUC,
// );
// export const updateBillingStatusController = new UpdateBillingStatusController(
//   updateBillingUC,
// );
// export const createSubscriptionController = new CreateSubscriptionController(
//   createOrderUC,
// );
// export const verifyPaymentController = new VerifyPaymentController(
//   verifyPaymentUC,
// );
