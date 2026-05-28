import { randomUUID } from "crypto";
import { SubscriptionPlanRepository } from "../../domain/repository/subscription-plan.repository";
import { CreatePlanInput } from "../dto/createSubscription.dto";
import {
  SubscriptionPlan,
  PlanType,
  Currency,
  BillingCycle,
} from "../../domain/entities/subscription-plan.entity";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../constants/errorcode.constants";

export class CreateSubscriptionPlanUseCase {
  constructor(private readonly repo: SubscriptionPlanRepository) {}

  async execute(input: CreatePlanInput): Promise<SubscriptionPlan> {
    const planType = input.planType as PlanType;
    const currency = input.currency as Currency;
    const billingCycle = input.billingCycle as BillingCycle;
    const existing = await this.repo.findByPlanType(planType);
    if (existing) {
      throw new ApplicationError(ERROR_CODES.PLAN_ALREADY_EXISTS);
    }

    const plan = SubscriptionPlan.create({
      id: randomUUID(),
      name: input.name,
      description: input.description,
      planType,
      price: input.price,
      currency,
      billingCycle,
      billingInterval: input.billingInterval,
      jobPostsPerMonth: input.jobPostsPerMonth,
      screeningCredits: input.screeningCredits,
      resumeParsesPerMonth: input.resumeParsesPerMonth,
      aiScoreCredits: input.aiScoreCredits,
      featuresAccess: input.featuresAccess,
      features: input.features,
      isPopular: input.isPopular ?? false,
      sortOrder: input.sortOrder ?? 0,
      isActive: true,
      razorpayPlanId: input.razorpayPlanId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.repo.save(plan);

    return plan;
  }
}
