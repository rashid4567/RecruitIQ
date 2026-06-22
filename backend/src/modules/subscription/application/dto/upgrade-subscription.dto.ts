import { RecruiterSubscription } from "../../domain/entities/recruiter-subscription.entity";

export interface UpgradeSubscriptionRequestDTO {
  recruiterId: string;
  newPlanId: string;
  durationMonths: number;
}

