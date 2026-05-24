import {
  PlanType,
  type BillingCycle,
  type Currency,
} from "../constatns/subscription.constants";

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
  private readonly props: SubscriptionPlanProps;
  private constructor(props: SubscriptionPlanProps) {
    this.props = props;
  }

  static create(props: SubscriptionPlanProps): SubscriptionPlan {
    if (!props.id || props.id.trim() === "") {
      throw new Error(
        `[SubscriptionPlan] Entity cannot be created without a valid id. Plan name: "${props.name ?? "(unnamed)"}"`,
      );
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

  get displayPrice(): string {
    if (this.isFree) {
      return "Free";
    }
    return `${this.props.currency} ${this.props.price.toLocaleString()}`;
  }

  get displayJobPosts(): string {
    if (this.hasUnlimitedJobPosts) {
      return "Unlimited";
    }
    return (this.props.jobPostsPerMonth ?? 0).toString();
  }

  get displayScreeningCredits(): string {
    if (this.hasUnlimitedScreeningCredits) {
      return "Unlimited";
    }
    return (this.props.screeningCredits ?? 0).toString();
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
