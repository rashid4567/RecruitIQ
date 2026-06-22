import { SubscriptionPlan } from "../../domain/entities/subscription-plan.entity";

export interface GetAllPlansRequestDTO {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface GetAllPlansResponseDTO {
  data: SubscriptionPlan[];
  total: number;
}