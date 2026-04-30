
import { ApplicationError } from "../../../../../shared/errors/application.error";
import {
  SubscriptionPlan,
  SubscriptionPlanProps,
} from "../../../Domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../Domain/repositories/subscription-plan.repository";
import { UpdatePlanInput } from "../../dto/subscription-plan.dto/updateplan-input.dto";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class UpdateSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(
    planId: string,
    input: UpdatePlanInput,
  ): Promise<SubscriptionPlan> {
    const existing = await this.subscriptionPlanRepository.findById(planId);
    if (!existing) {
      throw new ApplicationError(ERROR_CODES.PLAN_NOT_FOUND);
    }

    if (input.name !== undefined && input.name.trim().length < 2) {
      throw new ApplicationError(ERROR_CODES.INVALID_PLAN_NAME);
    }
    if (input.price !== undefined && input.price < 0) {
      throw new ApplicationError(ERROR_CODES.INVALID_PRICE);
    }
    if (input.billingInterval !== undefined && input.billingInterval < 1) {
      throw new ApplicationError(ERROR_CODES.INVALID_BILLING_INTERVAL);
    }

    const updatedProps: SubscriptionPlanProps = {
      id: existing.id,
      name: input.name?.trim() ?? existing.name,
      planType: existing.planType,
      price: input.price ?? existing.price,
      currency: input.currency ?? existing.currency,
      billingCycle: input.billingCycle ?? existing.billingCycle,
      billingInterval: input.billingInterval ?? existing.billingInterval,
      jobPostsPerMonth: input.jobPostsPerMonth ?? existing.jobPostsPerMonth,
      screeningCredits: input.screeningCredits ?? existing.screeningCredits,
      featuresAccess: {
        ...existing.featuresAccess,
        ...input.featuresAccess,
      },
      features: input.features ?? existing.features,
      isPopular: input.isPopular ?? existing.isPopular,
      sortOrder: input.sortOrder ?? existing.sortOrder,
      isActive: existing.isActive,
      description: input.description ?? existing.description,
      razorpayPlanId: input.razorpayPlanId ?? existing.razorpayPlanId,
      createdAt: existing.createdAt,
    };

    const updatedPlan = SubscriptionPlan.fromPersistence(updatedProps);
    return this.subscriptionPlanRepository.update(updatedPlan);
  }
}
