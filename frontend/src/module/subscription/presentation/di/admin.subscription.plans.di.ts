import { ApiAdminSubscriptionPlanRepository } from "@/module/subscription/infrastructure/repositories/ApiAdmin.Subscription.repository";
import { CreatePlanUseCase } from "../../application/usecase/subscription/admin/create-plan.usecase";
import { GetPlanByIdUseCase } from "../../application/usecase/subscription/admin/get-plan-by-id.usecase";
import { GetPlansUseCase } from "../../application/usecase/subscription/admin/get-plans.usecase";
import { HidePlanUseCase } from "../../application/usecase/subscription/admin/hide-plan.usecase";
import { UnhidePlanUseCase } from "../../application/usecase/subscription/admin/unhide-plan.usecase";
import { UpdatePlanUseCase } from "../../application/usecase/subscription/admin/update-plan.usecase";
import { GetSubscribersUseCase } from "../../application/usecase/subscription/admin/subscribers/get.subscribers.list.usecase";
import { ApiAdminSubscriptionRepository } from "../../infrastructure/repositories/ApiSubscribers.repository";


const subscriptionRepo = new ApiAdminSubscriptionPlanRepository();
const SubscribersRepo = new ApiAdminSubscriptionRepository();

export const createPlanUC = new CreatePlanUseCase(subscriptionRepo);
export const getPlanByIdUC = new GetPlanByIdUseCase(subscriptionRepo);
export const getPlansUC = new GetPlansUseCase(subscriptionRepo);
export const hidePlanUC = new HidePlanUseCase(subscriptionRepo);
export const unhidePlanUC = new UnhidePlanUseCase(subscriptionRepo);
export const updatePlanUC = new UpdatePlanUseCase(subscriptionRepo);
export const getSubscribersUseCase = new GetSubscribersUseCase(SubscribersRepo)