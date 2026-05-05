import { RecruiterSubscription } from "../../../domain/entities/Recruitersubscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";

export interface GetCurrentSubscriptionRequest{
    recruiterId : string;
}


export type GetCurrentSubscriptionResponse = RecruiterSubscription | null;

export class GetCurrentSubscriptionUseCase{
    constructor(private readonly subscriptionRepo : RecruiterSubscriptionRepository){};

    async execute(request : GetCurrentSubscriptionRequest):Promise<GetCurrentSubscriptionResponse>{
        return this.subscriptionRepo.findActiveByRecruiterId(request.recruiterId)
    }
}