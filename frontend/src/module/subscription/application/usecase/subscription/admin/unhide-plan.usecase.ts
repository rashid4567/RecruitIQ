import type { AdminSubscriptionPlanRepository } from "@/module/subscription/domain/repositories/admin-subscription-plan.repository";

export class UnhidePlanUseCase {
    private readonly subscriptionPlanRepo : AdminSubscriptionPlanRepository;
    constructor(subscriptionPlanRepo : AdminSubscriptionPlanRepository){
        this.subscriptionPlanRepo = subscriptionPlanRepo
    }

    async execute(planId : string):Promise<void>{
        return this.subscriptionPlanRepo.unhide(planId);
    }
}