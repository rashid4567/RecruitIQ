import { SubscriptionPlanFilter } from "../../../../../admin/Domain/repositories/subscription-plan.repository";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../../domain/repository/subscription-plan.repository";

export interface GetAllPlansOutput {
  data: SubscriptionPlan[];

  total: number;
}
export class GetAllSubscriptionPlansUseCase {
  constructor(private readonly repo: SubscriptionPlanRepository) {}
  async execute(filter: SubscriptionPlanFilter): Promise<GetAllPlansOutput> {
    const { data, total } = await this.repo.findAll(filter);
    return {
      data,
      total,
    };
  }
}
