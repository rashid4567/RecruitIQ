import { SubscriptionPlan } from "../../../domain/entities/Subscriptionplan.entity";
import { SubscriptionPlanRepository } from "../../../domain/repositories/Subscription.repository";

export type GetActivePlansReponse = SubscriptionPlan[];

export class GetAllPlansUseCase{
    constructor(private readonly subscribtionRepo : SubscriptionPlanRepository){};

    async execute():Promise<GetActivePlansReponse>{
        const plans = await this.subscribtionRepo.findActivePlans();
        return plans;
    }
}