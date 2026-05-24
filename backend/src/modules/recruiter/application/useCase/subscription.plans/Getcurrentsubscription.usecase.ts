import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import {
  RecruiterSubscription,
  SubscriptionStatus,
} from "../../../domain/entities/Recruitersubscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { RecruiterProfileRepository } from "../../../domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface GetCurrentSubscriptionRequest {
  recruiterId: string;
}

export type GetCurrentSubscriptionResponse = RecruiterSubscription | null;

export class GetCurrentSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
    private readonly recruiterRepo: RecruiterProfileRepository,
  ) {}

  async execute(
    request: GetCurrentSubscriptionRequest,
  ): Promise<GetCurrentSubscriptionResponse> {
    const subscription = await this.subscriptionRepo.findActiveByRecruiterId(
      request.recruiterId,
    );

    if (!subscription) {
      throw new ApplicationError(ERROR_CODES.SUBSCRIPTION_NOT_FOUND);
    }
    if (subscription.isExpired) {
      const updatedSubscription = await this.subscriptionRepo.updateStatus(
        subscription.id,
        SubscriptionStatus.Expired,
      );

      const profile = await this.recruiterRepo.findByUserId(
        UserId.create(request.recruiterId),
      )

      if(profile){
        profile.updateSubscriptionStatus("expired")
        await this.recruiterRepo.save(profile);
      }

      return updatedSubscription;
      
    }

    return subscription;
  }
}
