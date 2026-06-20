import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
export class CancelSubscriptionUseCase {
  constructor(private readonly repo: RecruiterSubscriptionRepository) {}

  async execute(recruiterId: string) {
    const subscription = await this.repo.findActiveByRecruiter(recruiterId);
    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }
    const cancelled = subscription.cancel();
    await this.repo.update(cancelled);
    return cancelled;
  }
}
