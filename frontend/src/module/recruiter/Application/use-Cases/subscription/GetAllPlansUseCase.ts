import type { SubscriptionPlan } from "@/module/recruiter/Domain/entities/SubscriptionPlan.entity";
import type { PlanFilterOptions, SubscriptionPlanRepository } from "@/module/recruiter/Domain/repositories/subscription-plan.repository";

export interface GetAllPlansResponse {
  plans: SubscriptionPlan[];
  total: number;
}

export interface GetAllPlansInput {
  filters?: PlanFilterOptions;
  activeOnly?: boolean;
}

export class GetAllPlansUseCase {
  private readonly planRepo: SubscriptionPlanRepository;

  constructor(planRepo: SubscriptionPlanRepository) {
    this.planRepo = planRepo;
  }

  async execute(input?: GetAllPlansInput): Promise<GetAllPlansResponse> {
    const plans =
      input?.activeOnly === false
        ? await this.planRepo.findAll(input?.filters)
        : await this.planRepo.findByActivePlans();

    if (!plans || plans.length === 0) {
      return { plans: [], total: 0 };
    }

    const sorted = [...plans].sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      plans: sorted,
      total: sorted.length,
    };
  }
}