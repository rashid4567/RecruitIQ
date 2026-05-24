import type { SubscriptionPlanRepository } from "@/module/admin/domain/repositories/subscription.repository";

export class HidePlanUseCase{
    private readonly subscriptionPlanRepo : SubscriptionPlanRepository
    constructor(subscriptionPlanRepo : SubscriptionPlanRepository){
        this.subscriptionPlanRepo = subscriptionPlanRepo
    }

    async execute(planId : string):Promise<void>{
        return this.subscriptionPlanRepo.hide(planId);
    }
}