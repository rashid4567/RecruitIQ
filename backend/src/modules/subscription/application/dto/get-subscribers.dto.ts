import { RecruiterSubscription } from "../../domain/entities/recruiter-subscription.entity";
import { PaginatedSubscribers } from "../../domain/repository/recruiter-subscription-plan-repository";

export interface GetSubscribersRequestDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}


export type GetSubscribersResponseDTO = PaginatedSubscribers;