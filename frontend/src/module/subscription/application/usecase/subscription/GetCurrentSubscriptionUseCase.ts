import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
import type { RecruiterSubscriptionRepository } from "@/module/subscription/domain/repositories/recruiter-subscription.repository";


export interface GetCurrentSubscriptionResponse {
  subscription: RecruiterSubscription | null;
  hasActiveSubscription: boolean;
}
export class GetCurrentSubscriptionUseCase{
    private readonly subRepo : RecruiterSubscriptionRepository
    constructor( subRepo : RecruiterSubscriptionRepository){
        this.subRepo = subRepo;
    }

    async execute():Promise<GetCurrentSubscriptionResponse>{
        const subscription = await this.subRepo.getCurrentSubscription();

        return {
            subscription,
            hasActiveSubscription : subscription !== null && subscription.isActive
        }
    }
}