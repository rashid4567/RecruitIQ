import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { SubscriptionStatus } from "../../../domain/entities/Recruitersubscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { RecruiterProfileRepository } from "../../../domain/repositories/recruiter.repository";

export class ExpireSubscriptionsUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly recruiterRepo: RecruiterProfileRepository,
  ) {}

  async execute(): Promise<{ expired: number; errors: number }> {
    let expired = 0;
    let errors = 0;

    const expiredSubs = await this.subscriptionRepo.findExpiredActive();

    for (const subscription of expiredSubs) {
      try {
        await this.subscriptionRepo.updateStatus(
          subscription.id,
          SubscriptionStatus.Expired,
        );

        const profile = await this.recruiterRepo.findByUserId(
          UserId.create(subscription.recruiterId),
        );

        if (profile) {
          profile.updateSubscriptionStatus("expired");
          await this.recruiterRepo.save(profile);
        }

        expired++;
      } catch (err) {
        console.error(
          `Failed to expire subscription ${subscription.id}`,
          err,
        );
        errors++;
      }
    }

    return { expired, errors };
  }
}