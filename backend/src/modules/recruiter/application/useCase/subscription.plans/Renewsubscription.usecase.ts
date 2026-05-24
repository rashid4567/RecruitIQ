import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterSubscription } from "../../../domain/entities/Recruitersubscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { RecruiterProfileRepository } from "../../../domain/repositories/recruiter.repository";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface RenewSubscriptionRequest {
  subscriptionId: string;
  newStartDate: Date;
  newEndDate: Date;
  newRenewsAt?: Date;
}

export type RenewSubscriptionResponse = RecruiterSubscription;
export class RenewSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly recruiterRepo: RecruiterProfileRepository,
  ) {}

  async execute(
    request: RenewSubscriptionRequest,
  ): Promise<RenewSubscriptionResponse> {
    const subscription = await this.subscriptionRepo.findById(
      request.subscriptionId,
    );
    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }

    const renewedSubscription = await this.subscriptionRepo.renew({
      subscriptionId: request.subscriptionId,
      newStartDate: request.newStartDate,
      newEndDate: request.newEndDate,
      newRenewsAt: request.newRenewsAt,
    });

    const profile = await this.recruiterRepo.findByUserId(
      UserId.create(subscription.recruiterId),
    );

    if(profile){
      profile.updateSubscriptionStatus("active");
      await this.recruiterRepo.save(profile)
    }

  return renewedSubscription

    
  }
}
