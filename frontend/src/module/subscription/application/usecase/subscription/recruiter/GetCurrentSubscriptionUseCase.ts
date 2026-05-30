import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
import type { RecruiterSubscriptionRepository } from "@/module/subscription/domain/repositories/recruiter-subscription.repository";

export interface GetCurrentSubscriptionResponse {
  subscription: RecruiterSubscription | null;
  hasActiveSubscription: boolean;
  daysRemaining: number;
}

export class GetCurrentSubscriptionUseCase {
  private readonly subRepo: RecruiterSubscriptionRepository;

  constructor(subRepo: RecruiterSubscriptionRepository) {
    this.subRepo = subRepo;
  }

  async execute(): Promise<GetCurrentSubscriptionResponse> {
    const subscription = await this.subRepo.getCurrentSubscription();

    if (!subscription) {
      return {
        subscription: null,
        hasActiveSubscription: false,
        daysRemaining: 0,
      };
    }

    const daysRemaining = Math.max(
      0,
      Math.ceil(
        (subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      ),
    );

    return {
      subscription,
      hasActiveSubscription: subscription.isActive,
      daysRemaining,
    };
  }
}
