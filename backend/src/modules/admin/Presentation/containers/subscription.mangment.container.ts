import { CreateSubscriptionPlanUseCase } from "../../Application/use-Cases/subscription-plan/create-plan.usecase";
import { GetAllPlanUseCase } from "../../Application/use-Cases/subscription-plan/get-all-plans.usecase";
import { GetPlanByUseCase } from "../../Application/use-Cases/subscription-plan/get-plan-by-id.usecase";
import { HidePlanUseCase } from "../../Application/use-Cases/subscription-plan/hide-plan.usecase";
import { UnhidePlanUseCase } from "../../Application/use-Cases/subscription-plan/unhide-plan.usecase";
import { UpdateSubscriptionPlanUseCase } from "../../Application/use-Cases/subscription-plan/update-plan.usecase";
import { SubscriptionPlanRepository } from "../../Domain/repositories/subscription-plan.repository";
import { MongooseSubscriptionPlanRepository } from "../../Infrastructure/repositories/subscription-plan.mongoose.repository";
import { CreateSubscriptionPlanController } from "../controller/Subscription.plans.managment.ts/create-plan.controller";
import { UpdateSubscriptionPlanController } from "../controller/Subscription.plans.managment.ts/update-subscription-plan.controller";
import { GetSubscriptionPlanController } from "../controller/Subscription.plans.managment.ts/get-plan.controller";
import { GetPlanByIdController } from "../controller/Subscription.plans.managment.ts/get-plan-by-id.controller";
import { HidePlanController } from "../controller/Subscription.plans.managment.ts/hide-plan.controller";
import { UnhidePlanController } from "../controller/Subscription.plans.managment.ts/unhide-plan.controller";
const subscriptionRepo: SubscriptionPlanRepository =
  new MongooseSubscriptionPlanRepository();

const createPlanUC = new CreateSubscriptionPlanUseCase(subscriptionRepo);
const updatePlanUC = new UpdateSubscriptionPlanUseCase(subscriptionRepo);
const getAllPlanUC = new GetAllPlanUseCase(subscriptionRepo);
const getPlanByIdUC = new GetPlanByUseCase(subscriptionRepo);
const hidePlanUC = new HidePlanUseCase(subscriptionRepo);
const unhidePlanUC = new UnhidePlanUseCase(subscriptionRepo);

export const createPlanController = new CreateSubscriptionPlanController(
  createPlanUC,
);
export const updatePlanController = new UpdateSubscriptionPlanController(
  updatePlanUC,
);
export const getPlanController = new GetSubscriptionPlanController(
  getAllPlanUC,
  getPlanByIdUC,
);
export const getPlanByIdController = new GetPlanByIdController(getPlanByIdUC);
export const hidePlanController = new HidePlanController(hidePlanUC);
export const unhidePlanController = new UnhidePlanController(unhidePlanUC);
