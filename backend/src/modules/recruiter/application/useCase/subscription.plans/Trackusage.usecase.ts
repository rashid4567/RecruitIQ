import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterSubscription } from "../../../domain/entities/Recruitersubscription.entity";
import { RecruiterSubscriptionRepository } from "../../../domain/repositories/recruiter-subscription.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export interface TrackUsageRequest {
  recruiterId: string;
  jobPostDelta?: number;
  screeningCreditDelta?: number;
}

export type TrackUsageResponse = RecruiterSubscription;

export class TrackUsageUseCase {
  constructor(
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(request: TrackUsageRequest): Promise<TrackUsageResponse> {
    const subscription = await this.subscriptionRepo.findActiveByRecruiterId(
      request.recruiterId,
    );

   if (!subscription) {
  throw new ApplicationError(
    ERROR_CODES.NO_ACTIVE_SUBSCRIPTION_FOUND_FOR_THIS_RECRUITER
  );
}


    if (
  request.jobPostDelta === undefined &&
  request.screeningCreditDelta === undefined
) {
  throw new ApplicationError(
    ERROR_CODES.NO_USAGE_CHANGE_PROVIDED
  );
}

  if (
  request.jobPostDelta !== undefined &&
  ![1, -1].includes(request.jobPostDelta)
) {
  throw new ApplicationError(
    ERROR_CODES.INVALID_JOB_POST_DELTA
  );
}

  
if (
  request.screeningCreditDelta !== undefined &&
  ![1, -1].includes(request.screeningCreditDelta)
) {
  throw new ApplicationError(
    ERROR_CODES.INVALID_SCREENING_CREDIT_DELTA
  );
}

 if (
  request.jobPostDelta !== undefined &&
  request.jobPostDelta > 0 &&
  !subscription.canPostJob()
) {
  throw new ApplicationError(
    ERROR_CODES.JOB_POST_LIMIT_EXCEEDED
  );
}

    
if (
  request.screeningCreditDelta !== undefined &&
  request.screeningCreditDelta > 0 &&
  !subscription.canUseScreeningCredit()
) {
  throw new ApplicationError(
    ERROR_CODES.SCREENING_CREDIT_LIMIT_EXCEEDED
  );
}
    return this.subscriptionRepo.updateUsage({
      subscriptionId: subscription.id,
      jobPostsDelta: request.jobPostDelta,
      screeningCreditsDelta: request.screeningCreditDelta,
    });
  }
}
