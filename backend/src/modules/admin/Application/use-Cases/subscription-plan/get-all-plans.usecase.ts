import { SubscriptionPlan } from "../../../Domain/entities/subscription-plan.entity";
import { SubscriptionPlanFilter, SubscriptionPlanRepository } from "../../../Domain/repositories/subscription-plan.repository";

export interface GetAllPlansOutPut{
    data : SubscriptionPlan[];
    total : number;
}

export class GetAllPlanUseCase{
    constructor(private readonly SubscribtionRepo : SubscriptionPlanRepository){};

    async execute(filter : SubscriptionPlanFilter):Promise<GetAllPlansOutPut>{
        const {data, total} = await this.SubscribtionRepo.findAll(filter);
        return {data, total};
    }
}