import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { DomainError } from "../../../../shared/errors/domain.error";

export type BillingCycle = "weekly" | "monthly" | "yearly";
export type Currency = "INR" | "USD" | "EUR" | "GBP";
export type PlanType = "free" | "basic" | "pro" | "enterprise";

export interface FeaturesAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface SubscriptionPlanProps {
  id: string;
  name: string;
  planType: PlanType;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingInterval: number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  featuresAccess: FeaturesAccess;
  features: PlanFeature[];
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  description?: string;
  razorpayPlanId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly planType: PlanType,
    public readonly price: number,
    public readonly currency: Currency,
    public readonly billingCycle: BillingCycle,
    public readonly billingInterval: number,
    public readonly jobPostsPerMonth: number,
    public readonly screeningCredits: number,
    public readonly featuresAccess: FeaturesAccess,
    public readonly features: PlanFeature[],
    public readonly isPopular: boolean,
    public readonly sortOrder: number,
    public readonly isActive: boolean,
    public readonly description?: string,
    public readonly razorpayPlanId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static fromPersistence(props: SubscriptionPlanProps): SubscriptionPlan {
    return new SubscriptionPlan(
      props.id,
      props.name,
      props.planType,
      props.price,
      props.currency,
      props.billingCycle,
      props.billingInterval,
      props.jobPostsPerMonth,
      props.screeningCredits,
      props.featuresAccess,
      props.features,
      props.isPopular,
      props.sortOrder,
      props.isActive,
      props.description,
      props.razorpayPlanId,
      props.createdAt,
      props.updatedAt,
    );
  }

  isFree(): boolean {
    return this.planType === "free";
  }

  isPaid(): boolean {
    return this.planType !== "free";
  }

  hasUnlimitedJobPosts(): boolean {
    return this.jobPostsPerMonth === -1;
  }

  hasUnlimitedScreeningCredits(): boolean {
    return this.screeningCredits === -1;
  }

  supportsInterviewScheduling(): boolean {
    return this.featuresAccess.interviewScheduling;
  }

  supportsAdvancedAnalytics(): boolean {
    return this.featuresAccess.advancedAnalytics;
  }

  hasPrioritySupport(): boolean {
    return this.featuresAccess.prioritySupport;
  }

  canBeActivated(): boolean {
    return !this.isActive;
  }

  canBeDeactivated(): boolean {
    return this.isActive;
  }

  requiresRazorpay(): boolean {
    return this.isPaid() && !this.razorpayPlanId;
  }

  activate(): SubscriptionPlan {
    if (!this.canBeActivated())
      throw new DomainError(ERROR_CODES.PLAN_ALREADY_ACTIVE);
    return SubscriptionPlan.fromPersistence({
      ...this.toProps(),
      isActive: true,
    });
  }

  deactivate(): SubscriptionPlan {
    if (!this.canBeDeactivated())
      throw new DomainError(ERROR_CODES.PLAN_ALREADY_INACTIVE);
    return SubscriptionPlan.fromPersistence({
      ...this.toProps(),
      isActive: false,
    });
  }

  markAsPopular(): SubscriptionPlan {
    return SubscriptionPlan.fromPersistence({
      ...this.toProps(),
      isPopular: true,
    });
  }

  unmarkAsPopular(): SubscriptionPlan {
    return SubscriptionPlan.fromPersistence({
      ...this.toProps(),
      isPopular: false,
    });
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPlanType(): PlanType {
    return this.planType;
  }

  getPrice(): number {
    return this.price;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  getBillingCycle(): BillingCycle {
    return this.billingCycle;
  }

  getRazorpayPlanId(): string | undefined {
    return this.razorpayPlanId;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  private toProps(): SubscriptionPlanProps {
    return {
      id: this.id,
      name: this.name,
      planType: this.planType,
      price: this.price,
      currency: this.currency,
      billingCycle: this.billingCycle,
      billingInterval: this.billingInterval,
      jobPostsPerMonth: this.jobPostsPerMonth,
      screeningCredits: this.screeningCredits,
      featuresAccess: this.featuresAccess,
      features: this.features,
      isPopular: this.isPopular,
      sortOrder: this.sortOrder,
      isActive: this.isActive,
      description: this.description,
      razorpayPlanId: this.razorpayPlanId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
