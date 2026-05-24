import type { SubscriptionPlan } from "@/module/admin/domain/entities/subscription-plan.entity";
import type { SubscriptionPlanRepository } from "@/module/admin/domain/repositories/subscription.repository";

export class GetPlanByIdUseCase{
    private readonly SubscriptionPlanRepo : SubscriptionPlanRepository
    constructor(SubscriptionPlanRepo : SubscriptionPlanRepository){
        this.SubscriptionPlanRepo = SubscriptionPlanRepo;
    }

    async execute(planId : string):Promise<SubscriptionPlan | null>{
        return this.SubscriptionPlanRepo.getPlanById(planId);
    }
}
