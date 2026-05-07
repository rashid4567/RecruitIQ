import { DomainError } from "../../../../shared/errors/domain.error";

import { ERROR_CODES } from "../constatns/recruiter.profile.error";

export enum BillingCycle {
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export enum PlanType {
  Free = "free",
  Basic = "basic",
  Pro = "pro",
  Enterprise = "enterprise",
}

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

  description?: string;

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

  createdAt: Date;

  updatedAt: Date;
}

export class SubscriptionPlan {
  private constructor(private readonly props: SubscriptionPlanProps) {}

  static create(props: SubscriptionPlanProps): SubscriptionPlan {
    if (props.price < 0) {
      throw new DomainError(ERROR_CODES.PLAN_PRICE_NEGATIVE);
    }

    if (props.billingInterval < 1) {
      throw new DomainError(ERROR_CODES.INVALID_BILLING_INTERVAL);
    }

    return new SubscriptionPlan(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get planType(): PlanType {
    return this.props.planType;
  }

  get price(): number {
    return this.props.price;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get billingCycle(): BillingCycle {
    return this.props.billingCycle;
  }

  get billingInterval(): number {
    return this.props.billingInterval;
  }

  get jobPostsPerMonth(): number {
    return this.props.jobPostsPerMonth;
  }

  get screeningCredits(): number {
    return this.props.screeningCredits;
  }

  get featuresAccess(): FeaturesAccess {
    return {
      ...this.props.featuresAccess,
    };
  }

  get features(): PlanFeature[] {
    return [...this.props.features];
  }

  get isPopular(): boolean {
    return this.props.isPopular;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isFree(): boolean {
    return this.props.planType === PlanType.Free || this.props.price === 0;
  }

  get hasUnlimitedJobPosts(): boolean {
    return this.props.jobPostsPerMonth === -1;
  }

  get hasUnlimitedScreeningCredits(): boolean {
    return this.props.screeningCredits === -1;
  }

  isHigherThan(other: SubscriptionPlan): boolean {
    const rank: Record<PlanType, number> = {
      [PlanType.Free]: 0,
      [PlanType.Basic]: 1,
      [PlanType.Pro]: 2,
      [PlanType.Enterprise]: 3,
    };

    return rank[this.props.planType] > rank[other.planType];
  }

  toPlainObject(): SubscriptionPlanProps {
    return {
      ...this.props,

      featuresAccess: {
        ...this.props.featuresAccess,
      },

      features: [...this.props.features],
    };
  }
}
