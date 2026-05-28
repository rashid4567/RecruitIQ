import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { RecruiterSubscription } from "../../domain/entities/recruiter-subscription.entity";
import { RecruiterSubscriptionRepository } from "../../domain/repository/recruiter-subscription-plan-repository";

export class GetCurrentSubscriptionUseCase{
    constructor(private readonly repo : RecruiterSubscriptionRepository){};
    async execute(recruiterId : string):Promise<RecruiterSubscription>{
        const subscription = await this.repo.findActiveByRecruiter(recruiterId);
        if(!subscription){
            throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND)
        }
        return subscription;
    }
}