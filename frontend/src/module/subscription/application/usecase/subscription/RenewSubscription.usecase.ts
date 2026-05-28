import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
import type { RecruiterSubscriptionRepository, RenewSubscriptionInput } from "@/module/subscription/domain/repositories/recruiter-subscription.repository";

export interface RenewSubscriptionRequest{
    subscriptionId : string;
    newStartDate : string;
    newEndDate : string;
    newRenewsAt ?: string;
}

export class RenewSubscriptionUseCase{
    private readonly subscriptionRepo : RecruiterSubscriptionRepository;
    constructor(subscriptionRepo : RecruiterSubscriptionRepository){
        this.subscriptionRepo = subscriptionRepo;
    }

    async execute(request : RenewSubscriptionRequest):Promise<RecruiterSubscription>{
        if(!request.subscriptionId){
            throw new Error("Subscription is required");
        }

        const input : RenewSubscriptionInput = {
            subscriptionId : request.subscriptionId,
            newStartDate : request.newStartDate,
            newEndDate : request.newEndDate,
            newRenewsAt : request.newRenewsAt,
        }

        const subscription = await this.subscriptionRepo.renew(input);
        return subscription;
    }
}