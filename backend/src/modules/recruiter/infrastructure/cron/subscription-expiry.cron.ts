// import cron from "node-cron";
// import { ExpireSubscriptionsUseCase } from "../../application/useCase/subscription.plans/ExpireSubscriptionsUseCase";
// import { MongooseRecruiterSubscriptionRepository } from "../../../subscription/infrastructure/repositories/mongoose-recruiter-subscription.repository";
// import { MongooseRecruiterProfileRepository } from "../repositories/mongoose-recruiter.repository";

// export function startSubscriptionScheduler(): void {
//   const subscriptionRepo = new MongooseRecruiterSubscriptionRepository();
//   const recruiterRepo = new MongooseRecruiterProfileRepository();
//   const expireSubscriptionsUC = new ExpireSubscriptionsUseCase(
//     subscriptionRepo,
//     recruiterRepo,
//   );

//   cron.schedule("0 0 * * *", async () => {
//     console.log("[Scheduler] Running subscription expiry check...");
//     try {
//       const result = await expireSubscriptionsUC.execute();
//       console.log(
//         `[Scheduler] Done — expired: ${result.expired}, errors: ${result.errors}`,
//       );
//     } catch (err) {
//       console.error("[Scheduler] Subscription expiry job failed:", err);
//     }
//   });

//   console.log("[Scheduler] Subscription expiry scheduler started");
// }
