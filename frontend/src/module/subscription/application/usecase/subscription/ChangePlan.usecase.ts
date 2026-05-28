// import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
// import type {
//   ChangePlanInput,
//   RecruiterSubscriptionRepository,
// } from "@/module/subscription/domain/repositories/recruiter-subscription.repository";
// import type { SubscriptionPlanRepository } from "@/module/subscription/Domain/repositories/subscription-plan.repository";

// export type ChangePlanDirection = "upgrade" | "downgrade" | "same";

// export interface ChangePlanRequest {
//   newPlanId: string;
//   newEndDate: string;
//   newRazorpaySubscriptionId?: string;
// }

// export interface ChangePlanResponse {
//   subscription: RecruiterSubscription;
//   direction: ChangePlanDirection;
//   previousPlanName: string;
//   newPlanName: string;
// }

// export class ChangePlanUseCase {
//   private readonly planRepo: SubscriptionPlanRepository;
//   private readonly subscriptionRepo: RecruiterSubscriptionRepository;
//   constructor(
//     subscriptionRepo: RecruiterSubscriptionRepository,
//     planRepo: SubscriptionPlanRepository,
//   ) {
//     this.subscriptionRepo = subscriptionRepo;
//     this.planRepo = planRepo;
//   }

//   async execute(request: ChangePlanRequest): Promise<ChangePlanResponse> {
//     const current = await this.subscriptionRepo.getCurrentSubscription();

//     if (!current || !current.isActive) {
//       throw new Error(
//         "No active subscription found. Please subscribe to a plan first.",
//       );
//     }

//     const newPlan = await this.planRepo.findById(request.newPlanId);

//     if (!newPlan) {
//       throw new Error("The selected plan was not found");
//     }

//     if (!newPlan.isActive) {
//       throw new Error("The selected plan is no longer available");
//     }

//     if (current.planId === newPlan.id) {
//       throw new Error("You are already subscribed to this plan");
//     }

//     const currentPlan = await this.planRepo.findById(current.planId);

//     let direction: ChangePlanDirection = "same";
//     if (currentPlan) {
//       direction = newPlan.isHigherThan(currentPlan) ? "upgrade" : "downgrade";
//     }

//     const input: ChangePlanInput = {
//       newPlanId: newPlan.id,
//       newEndDate: request.newEndDate,
//       newRazorpaySubscriptionId: request.newRazorpaySubscriptionId,
//     };

//     const subscription = await this.subscriptionRepo.changePlan(input);

//     return {
//       subscription,
//       direction,
//       previousPlanName: current.planName,
//       newPlanName: newPlan.name,
//     };
//   }
// }
