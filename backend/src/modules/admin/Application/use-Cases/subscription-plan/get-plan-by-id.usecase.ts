import { ApplicationError } from "../../../../../shared/errors/application.error";
import { SubscriptionPlan } from "../../../Domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../Domain/repositories/subscription-plan.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class GetPlanByUseCase{
    constructor(private readonly subscriptionRepo : SubscriptionPlanRepository){};
   
    async execute(planId : string):Promise<SubscriptionPlan>{
        const plan = await this.subscriptionRepo.findById(planId);

        if(!plan){
            throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
        }
        return plan;
    }
}