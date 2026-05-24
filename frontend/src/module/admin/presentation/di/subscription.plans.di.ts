import { CreatePlanUseCase } from "../../application/useCases/subscription.management/create-plan.usecase";
import { GetPlanByIdUseCase } from "../../application/useCases/subscription.management/get-plan-by-id.usecase";
import { GetPlansUseCase } from "../../application/useCases/subscription.management/get-plans.usecase";
import { HidePlanUseCase } from "../../application/useCases/subscription.management/hide-plan.usecase";
import { UnhidePlanUseCase } from "../../application/useCases/subscription.management/unhide-plan.usecase";
import { UpdatePlanUseCase } from "../../application/useCases/subscription.management/update-plan.usecase";
import { ApiSubscriptionPlanRepository } from "../../infrastructure/repositories/Api-subscription.plan.repository";

const subscriptionRepo = new ApiSubscriptionPlanRepository();


export const createPlanUC = new CreatePlanUseCase(subscriptionRepo);
export const getPlanByIdUC = new GetPlanByIdUseCase(subscriptionRepo);
export const getPlansUC = new GetPlansUseCase(subscriptionRepo);
export const hidePlanUC = new HidePlanUseCase(subscriptionRepo);
export const unhidePlanUC = new UnhidePlanUseCase(subscriptionRepo);
export const updatePlanUC = new UpdatePlanUseCase(subscriptionRepo);
