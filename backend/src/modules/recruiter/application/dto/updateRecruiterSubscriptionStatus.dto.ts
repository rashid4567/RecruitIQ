import { subscriptionStatus } from "../../domain/constatns/subscriptionStatus.constants";

export interface UpdateRecruiterSubscriptionStatusRequestDTO {
  recruiterId: string;
  status: subscriptionStatus;
}
