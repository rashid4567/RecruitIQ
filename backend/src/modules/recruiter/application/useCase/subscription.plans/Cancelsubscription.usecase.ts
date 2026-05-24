import { ApplicationError } from "../../../../../shared/errors/application.error";
import {CancellationReason, RecruiterSubscription,} from "../../../domain/entities/Recruitersubscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { RecruiterProfileRepository } from "../../../domain/repositories/recruiter.repository";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface CancelSubscriptionRequest {
  recruiterId: string;
  note?: string;
  cancelAtPeriodEnd: boolean;
}

export type CancelSubscriptionResponse = RecruiterSubscription;
export class CancelSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly recruiterRepo : RecruiterProfileRepository,
  ) {}

  async execute(
    request: CancelSubscriptionRequest,
  ): Promise<CancelSubscriptionResponse> {
    if (!request.recruiterId) {
      throw new ApplicationError(ERROR_CODES.INVALID_RECRUITER_ID);
    }
    const subscription = await this.subscriptionRepo.findActiveByRecruiterId(
      request.recruiterId,
    );

    if (!subscription)
      throw new ApplicationError(
        ERROR_CODES.NO_ACTIVE_SUBSCRIPTION_FOUND_FOR_THIS_RECRUITER,
      );

    const cancelledSubscription = await this.subscriptionRepo.cancel({
      subscriptionId: subscription.id,
      cancelledAt: new Date(),
      reason: CancellationReason.UserRequested,
      note: request.note,
      cancelAtPeriodEnd: request.cancelAtPeriodEnd,
    });

    const profile = await this.recruiterRepo.findByUserId(
      UserId.create(request.recruiterId)
    )

    if(profile){
      profile.updateSubscriptionStatus("expired")

      await this.recruiterRepo.save(profile)
    }
    return cancelledSubscription;
  }
}
