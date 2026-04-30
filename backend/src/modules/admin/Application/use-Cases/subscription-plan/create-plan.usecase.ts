import { randomUUID } from "crypto";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import {
  SubscriptionPlan,
  SubscriptionPlanProps,
} from "../../../Domain/entities/subscription-plan.entity";
import { SubscriptionPlanRepository } from "../../../Domain/repositories/subscription-plan.repository";

import { ERROR_CODES } from "../../constants/errorcode.constants";
import { CreatePlanInput } from "../../dto/subscription-plan.dto/create_planInput.dto";

export class CreateSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
  ) {}

  async execute(input: CreatePlanInput): Promise<SubscriptionPlan> {
    const existing = await this.subscriptionPlanRepository.findByPlanType(
      input.planType,
    );
    if (existing) {
      throw new ApplicationError(ERROR_CODES.PLAN_ALREADY_EXISTS);
    }

    if (!input.name || input.name.trim().length < 2) {
      throw new ApplicationError(ERROR_CODES.INVALID_PLAN_NAME);
    }
    if (input.price < 0) {
      throw new ApplicationError(ERROR_CODES.INVALID_PRICE);
    }
    if (input.billingInterval < 1) {
      throw new ApplicationError(ERROR_CODES.INVALID_BILLING_INTERVAL);
    }

    const props: SubscriptionPlanProps = {
      id: randomUUID(),
      name: input.name.trim(),
      planType: input.planType,
      price: input.price,
      currency: input.currency,
      billingCycle: input.billingCycle,
      billingInterval: input.billingInterval,
      jobPostsPerMonth: input.jobPostsPerMonth,
      screeningCredits: input.screeningCredits,
      featuresAccess: input.featuresAccess,
      features: input.features,
      isPopular: input.isPopular ?? false,
      sortOrder: input.sortOrder ?? 0,
      isActive: true,
      description: input.description,
      razorpayPlanId: input.razorpayPlanId,
    };
    const plan = SubscriptionPlan.fromPersistence(props);
    return this.subscriptionPlanRepository.create(plan);
  }
}
