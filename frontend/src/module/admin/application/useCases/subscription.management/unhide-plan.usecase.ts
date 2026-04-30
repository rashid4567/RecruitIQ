import type { SubscriptionPlanRepository } from "@/module/admin/domain/repositories/subscription.repository";

export class UnhidePlanUseCase {
    private readonly subscriptionPlanRepo : SubscriptionPlanRepository;
    constructor(subscriptionPlanRepo : SubscriptionPlanRepository){
        this.subscriptionPlanRepo = subscriptionPlanRepo
    }

    async execute(planId : string):Promise<void>{
        return this.subscriptionPlanRepo.unhide(planId);
    }
}