import type { RecruiterSubscription } from "@/module/recruiter/Domain/entities/RecruiterSubscription.entity";
import type { RecruiterSubscriptionRepository, subscribeInput } from "@/module/recruiter/Domain/repositories/recruiter-subscription.repository";
import type { SubscriptionPlanRepository } from "@/module/recruiter/Domain/repositories/subscription-plan.repository";

export interface SubscribeRequest {
  planId: string;
  razorpaySubscriptionId?: string;
  razorpayOrderId?: string;
  razorpayCustomerId?: string;
  startDate: string;
  endDate: string;
  renewsAt?: string;
  autoRenew: boolean;
}


export class SubscribeUseCase{
    private readonly subscriptionRepo : RecruiterSubscriptionRepository;
    private readonly planRepo : SubscriptionPlanRepository;
    constructor( subscriptionRepo : RecruiterSubscriptionRepository, planRepo : SubscriptionPlanRepository){
        this.subscriptionRepo = subscriptionRepo;
        this.planRepo = planRepo;
    }

    async execute(request : SubscribeRequest):Promise<RecruiterSubscription>{
        if(!request.planId){
            throw new Error("Plan id is required")
        }

        const plan = await this.planRepo.findById(request.planId);

        if(!plan){
            throw new Error("Plan not found");
        }

        if(!plan.isActive){
            throw new Error("Plan is not longer available");
        }

        const existing = await this.subscriptionRepo.getCurrentSubscription();

        if(existing && existing.isActive){
            throw new Error("You already have an active subscription . please cancel or change your current plan first");
        }

        const input : subscribeInput = {
            planId : request.planId,
            razorpaySubscriptionId : request.razorpaySubscriptionId,
            razorpayOrderId : request.razorpayOrderId,
            razorpayCustomerId : request.razorpayCustomerId,
            startDate : request.startDate,
            endDate : request.endDate,
            renewsAt : request.renewsAt,
            autoRenew : request.autoRenew,
        }

        const subscription = await this.subscriptionRepo.subscribe(input)
        return subscription;
    }
}