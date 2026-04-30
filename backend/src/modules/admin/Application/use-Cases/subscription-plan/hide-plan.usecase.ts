import { ApplicationError } from "../../../../../shared/errors/application.error";
import { SubscriptionPlanRepository } from "../../../Domain/repositories/subscription-plan.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class HidePlanUseCase{
    constructor(private readonly subscriptionRepo : SubscriptionPlanRepository){};
    async execute(planId : string):Promise<void>{
        const plan = await this.subscriptionRepo.findById(planId);
        if(!plan){
            throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
        }

        plan.deactivate();

        await this.subscriptionRepo.setActive(planId, false);
    }
}