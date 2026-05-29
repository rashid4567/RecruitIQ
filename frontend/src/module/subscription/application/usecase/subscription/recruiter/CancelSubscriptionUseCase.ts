import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
import type { CancelSubscriptionInput, RecruiterSubscriptionRepository } from "@/module/subscription/domain/repositories/recruiter-subscription.repository";

export interface CancelSubscriptionRequest{
    note ?: string;
    cancelAtPeriodEnd : boolean;
}

export interface CancelSubscriptionResponse {
  subscription: RecruiterSubscription;
  cancelledImmediately: boolean;
}

export class CancelSubscriptionUseCase{
    private readonly subscriptionRepo : RecruiterSubscriptionRepository;
    constructor(subscriptionRepo : RecruiterSubscriptionRepository){
        this.subscriptionRepo = subscriptionRepo;
    }


    async execute(request : CancelSubscriptionRequest):Promise<CancelSubscriptionResponse>{
        const existing = await this.subscriptionRepo.getCurrentSubscription();

        if(!existing){
            throw new Error("No Active Subscription found to cancel");
        }

        if(!existing.isActive){
            throw new Error("Your subscription is not currently active")
        };

        const input : CancelSubscriptionInput = {
            note : request.note,
            cancelAtPeriodEnd : request.cancelAtPeriodEnd
        }

        const subscription = await this.subscriptionRepo.cancel(input);

        return {
            subscription,
            cancelledImmediately : !request.cancelAtPeriodEnd,
        }
    }
}