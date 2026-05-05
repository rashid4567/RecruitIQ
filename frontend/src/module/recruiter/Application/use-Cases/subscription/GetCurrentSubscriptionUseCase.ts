import type { RecruiterSubscription } from "@/module/recruiter/Domain/entities/RecruiterSubscription.entity";
import type { RecruiterSubscriptionRepository } from "@/module/recruiter/Domain/repositories/recruiter-subscription.repository";


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