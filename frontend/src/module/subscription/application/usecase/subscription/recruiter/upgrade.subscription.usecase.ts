import type { RecruiterSubscriptionRepository } from "@/module/subscription/domain/repositories/recruiter-subscription.repository";

export class UpgradeSubscriptionUseCase {
  private readonly subscriptionRepo: RecruiterSubscriptionRepository;

  constructor(
    subscriptionRepo: RecruiterSubscriptionRepository,
  ) {
    this.subscriptionRepo = subscriptionRepo;
  }

  async execute(planId: string): Promise<void> {
    if (!planId) {
      throw new Error("Plan ID is required");
    }

    await this.subscriptionRepo.upgradeSubscription(
      planId,
    );
  }
}