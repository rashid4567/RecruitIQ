import { ERROR_CODES } from "../../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";
import { DeactivateSubscriptionPlanRequestDTO } from "../../../dto/deactivate-subscription-plan.dto";

export class DeactivateSubscriptionPlanUseCase implements UseCase<DeactivateSubscriptionPlanRequestDTO,void>{
    constructor(private readonly repo : SubscriptionPlanRepository){};

    async execute(request : DeactivateSubscriptionPlanRequestDTO ):Promise<void>{
        const plan = await this.repo.findById(request.planId);
        if(!plan){
            throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
        }
        const updated = plan.deactivate();
        await this.repo.update(updated);
    }
}