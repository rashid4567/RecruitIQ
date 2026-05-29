// import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
// import type { RecruiterSubscriptionRepository, TrackUsageInput } from "@/module/subscription/domain/repositories/recruiter-subscription.repository";

// export interface TrackUsageRequest {
//   jobPostDelta?: 1 | -1;
//   screeningCreditDelta?: 1 | -1;
// }

// export interface TrackUsageResponse {
//   subscription: RecruiterSubscription;
//   remainingJobPosts: number | "unlimited";
//   remainingScreeningCredits: number | "unlimited";
// }



// export class TrackUsageUseCase{
//     private readonly subscriptionRepo : RecruiterSubscriptionRepository;
//     constructor(subscriptionRepo : RecruiterSubscriptionRepository){
//         this.subscriptionRepo = subscriptionRepo;
//     }


//     async execute(request : TrackUsageRequest):Promise<TrackUsageResponse>{
//         if(request.jobPostDelta === undefined && request.screeningCreditDelta === undefined){
//             throw new Error("At leastt one jobpost delete or screeningCreditDelta must be provided");
//         }

//         const current = await this.subscriptionRepo.getCurrentSubscription();

//         if(!current){
//             throw new Error("No active subscription found")
//         }

//         if(!current.isActive){
//             throw new Error("Your subscription is not currently active");
//         }

//         if(request.jobPostDelta === 1 && !current.canPostJob()){
//          throw new Error("You reached your jobpost limit . Please upgrade you plan to post more jobs . ");   
//         }

//         if(request.screeningCreditDelta === 1 && !current.canUseScreeningCredit()){
//             throw new Error("You have reached your screening limit please upgrade your plan to use more screening credits .");
//         }

//         const input : TrackUsageInput = {
//             jobPostDelta : request.jobPostDelta,
//             screeningCreditsDelta : request.screeningCreditDelta,
//         }

//         const subscription = await this.subscriptionRepo.trackUsage(input);

//         return {
//             subscription,
//             remainingJobPosts : subscription.remainingJobPosts,
//             remainingScreeningCredits : subscription.remainingScreeningCredits,
//         }
//     }
// }