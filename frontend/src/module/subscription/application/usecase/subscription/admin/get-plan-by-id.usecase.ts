import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";
import type { AdminSubscriptionPlanRepository } from "@/module/subscription/domain/repositories/admin-subscription-plan.repository";

export class GetPlanByIdUseCase{
    private readonly SubscriptionPlanRepo : AdminSubscriptionPlanRepository
    constructor(SubscriptionPlanRepo : AdminSubscriptionPlanRepository){
        this.SubscriptionPlanRepo = SubscriptionPlanRepo;
    }

    async execute(planId : string):Promise<SubscriptionPlan | null>{
        return this.SubscriptionPlanRepo.getPlanById(planId);
    }
}
