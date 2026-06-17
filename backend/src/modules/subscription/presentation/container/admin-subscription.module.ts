import { ActiveSubscriptionPlanUseCase } from "../../application/usecase/Admin/subscription/activate-subscription-plan.usecase";
import { CreateSubscriptionPlanUseCase } from "../../application/usecase/Admin/subscription/create-subscription-plan.usecase";
import { DeactivateSubscriptionPlanUseCase } from "../../application/usecase/Admin/subscription/deactivate-subscription-plan.usecase";
import { GetAllSubscriptionPlansUseCase } from "../../application/usecase/Admin/subscription/get-all-subscription-plans.usecase";
import { GetSubscriptionPlanUseCase } from "../../application/usecase/Admin/subscription/get-subscription-plan.usecase";
import { UpdateSubscriptionPlanUseCase } from "../../application/usecase/Admin/subscription/update-subscription-plan.usecase";
import { GetSubscribersUseCase } from "../../application/usecase/Admin/subscribers/GetSubscribersUseCase";
import { SubscriptionPlanRepository } from "../../domain/repository/subscription-plan.repository";
import { RecruiterSubscriptionRepository } from "../../domain/repository/recruiter-subscription-plan-repository";
import { MongooseSubscriptionPlanRepository } from "../../infrastructure/repositories/mongoose-subscription-plan.repository";
import { MongooseRecruiterSubscriptionRepository } from "../../infrastructure/repositories/mongoose-recruiter-subscription.repository";
import { CreateSubscriptionPlanController } from "../controller/admin/subscription/create-subscription-plan.controller";
import { GetSubscriptionPlanController } from "../controller/admin/subscription/get-subscription-plan.controller";
import { HideSubscriptionPlanController } from "../controller/admin/subscription/hide-subscription-plan.controller";
import { UnhideSubscriptionPlanController } from "../controller/admin/subscription/unhide-subscription-plan.controller";
import { UpdateSubscriptionPlanController } from "../controller/admin/subscription/update-subscription-plan.controller";
import { GetSubscribersController } from "../controller/admin/subscribers/get.Subscribers.controller";
import { GetPlanDetailController } from "../controller/recruiter/get-plan-detail.controller";
import { RecruiterPlanDetailController } from "../controller/recruiter/get.plans.controller";

const subscriptionRepo: SubscriptionPlanRepository =
  new MongooseSubscriptionPlanRepository();
const recruiterSubscriptionRepo: RecruiterSubscriptionRepository =
  new MongooseRecruiterSubscriptionRepository();

const createPlanUC = new CreateSubscriptionPlanUseCase(subscriptionRepo);
const updatePlanUC = new UpdateSubscriptionPlanUseCase(subscriptionRepo);
const getPlansUC = new GetAllSubscriptionPlansUseCase(subscriptionRepo);
const getPlanUC = new GetSubscriptionPlanUseCase(subscriptionRepo);
const activatePlanUC = new ActiveSubscriptionPlanUseCase(subscriptionRepo);
const deactivatePlanUC = new DeactivateSubscriptionPlanUseCase(
  subscriptionRepo,
);
const getSubscribersUseCase = new GetSubscribersUseCase(
  recruiterSubscriptionRepo,
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
export const getSubscribersController = new GetSubscribersController(
  getSubscribersUseCase,
);
export const recruiterSubscriptionPlanController =
  new RecruiterPlanDetailController(getPlansUC);
export const recruiterPlanDetailController = new GetPlanDetailController(
  getPlanUC,
);
