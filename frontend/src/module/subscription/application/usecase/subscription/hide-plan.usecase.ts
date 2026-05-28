import type { AdminSubscriptionPlanRepository } from "@/module/subscription/domain/repositories/admin-subscription-plan.repository";

export class HidePlanUseCase{
    private readonly subscriptionPlanRepo : AdminSubscriptionPlanRepository
    constructor(subscriptionPlanRepo : AdminSubscriptionPlanRepository){
        this.subscriptionPlanRepo = subscriptionPlanRepo
    }

    async execute(planId : string):Promise<void>{
        return this.subscriptionPlanRepo.hide(planId);
    }
}