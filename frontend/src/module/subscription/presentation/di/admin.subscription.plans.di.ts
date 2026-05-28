import { ApiAdminSubscriptionPlanRepository } from "@/module/subscription/infrastructure/repositories/ApiAdmin.Subscription.repository";
import { CreatePlanUseCase } from "../../application/usecase/subscription/create-plan.usecase";
import { GetPlanByIdUseCase } from "../../application/usecase/subscription/get-plan-by-id.usecase";
import { GetPlansUseCase } from "../../application/usecase/subscription/get-plans.usecase";
import { HidePlanUseCase } from "../../application/usecase/subscription/hide-plan.usecase";
import { UnhidePlanUseCase } from "../../application/usecase/subscription/unhide-plan.usecase";
import { UpdatePlanUseCase } from "../../application/usecase/subscription/update-plan.usecase";

const subscriptionRepo = new ApiAdminSubscriptionPlanRepository();


export const createPlanUC = new CreatePlanUseCase(subscriptionRepo);
export const getPlanByIdUC = new GetPlanByIdUseCase(subscriptionRepo);
export const getPlansUC = new GetPlansUseCase(subscriptionRepo);
export const hidePlanUC = new HidePlanUseCase(subscriptionRepo);
export const unhidePlanUC = new UnhidePlanUseCase(subscriptionRepo);
export const updatePlanUC = new UpdatePlanUseCase(subscriptionRepo);
