import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { RecruiterSubscriptionRepository } from "../../../domain/repository/recruiter-subscription-plan-repository";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CancelSubscriptionRequestDTO } from "../../dto/cancel-subscription.dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";
export class CancelSubscriptionUseCase implements IUseCase<
  CancelSubscriptionRequestDTO,
  RecruiterSubscription
> {
  constructor(private readonly repo: RecruiterSubscriptionRepository) {}

  async execute(
    request: CancelSubscriptionRequestDTO,
  ): Promise<RecruiterSubscription> {
    const subscription = await this.repo.findActiveByRecruiter(
      request.recruiterId,
    );
    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }
    const cancelled = subscription.cancel();
    await this.repo.update(cancelled);
    return cancelled;
  }
}
