import { DomainError } from "../../../../shared/errors/domain.error";
import { SUBSCRIPTION_ERRORS } from "../error/error.codes";

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

export interface FeatureAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  aiResumeScoring: boolean;
  resumeParsing: boolean;
  candidateShortlisting: boolean;
  exportReports: boolean;
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
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
  featuresAccess: FeatureAccess;
  features: PlanFeature[];
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  razorpayPlanId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionPlan {
  private constructor(private readonly props: SubscriptionPlanProps) {}
  static create(props: SubscriptionPlanProps): SubscriptionPlan {
    if (!props.name.trim()) {
      throw new DomainError(SUBSCRIPTION_ERRORS.PLAN_NAME_IS_REQUIRED);
    }
    if (props.price < 0) {
      throw new DomainError(SUBSCRIPTION_ERRORS.PRICE_CANNOT_BE_NEGATIVE);
    }
    if (props.billingInterval < 1) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_BILLING_INTERVAL);
    }
    if (props.sortOrder < 0) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_SORT_ORDER);
    }
    if (props.jobPostsPerMonth < -1) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_JOB_POST_LIMIT);
    }
    if (props.screeningCredits < -1) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_SCREENING_CREDITS);
    }
    if (props.resumeParsesPerMonth < -1) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_RESUME_LIMIT);
    }
    if (props.aiScoreCredits < -1) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_AI_SCORE_CREDIT);
    }
    if (props.planType === PlanType.Free && props.price !== 0) {
      throw new DomainError(SUBSCRIPTION_ERRORS.FREE_PLAN_MUST_BE_ZERO);
    }
    if (props.planType === PlanType.Free && props.razorpayPlanId) {
      throw new DomainError(SUBSCRIPTION_ERRORS.FREE_PLAN_CANNOT_HAVE_PAYMENT);
    }
    const names = new Set(props.features.map((x) => x.name.toLowerCase()));
    if (names.size !== props.features.length) {
      throw new DomainError(SUBSCRIPTION_ERRORS.DUPLICATE_FEATURE);
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
  get resumeParsesPerMonth(): number {
    return this.props.resumeParsesPerMonth;
  }
  get aiScoreCredits(): number {
    return this.props.aiScoreCredits;
  }
  get featuresAccess(): FeatureAccess {
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
  get razorpayPlanId(): string | undefined {
    return this.props.razorpayPlanId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  isFree(): boolean {
    return this.props.planType === PlanType.Free;
  }
  isPaid(): boolean {
    return !this.isFree();
  }
  hasUnlimitedJobs(): boolean {
    return this.props.jobPostsPerMonth === -1;
  }
  hasUnlimitedScreening(): boolean {
    return this.props.screeningCredits === -1;
  }
  hasUnlimitedResumeParses(): boolean {
    return this.props.resumeParsesPerMonth === -1;
  }
  hasUnlimitedAIScoring(): boolean {
    return this.props.aiScoreCredits === -1;
  }
  supportsInterview(): boolean {
    return this.props.featuresAccess.interviewScheduling;
  }
  supportsAnalytics(): boolean {
    return this.props.featuresAccess.advancedAnalytics;
  }
  supportsPriority(): boolean {
    return this.props.featuresAccess.prioritySupport;
  }
  supportsResumeParsing(): boolean {
    return this.props.featuresAccess.resumeParsing;
  }
  supportsAIScoring(): boolean {
    return this.props.featuresAccess.aiResumeScoring;
  }
  supportsCandidateShortlisting(): boolean {
    return this.props.featuresAccess.candidateShortlisting;
  }
  supportsExportReports(): boolean {
    return this.props.featuresAccess.exportReports;
  }
  activate(): SubscriptionPlan {
    if (this.isActive) {
      throw new DomainError(SUBSCRIPTION_ERRORS.PLAN_ALREADY_ACTIVE);
    }
    return new SubscriptionPlan({
      ...this.props,
      isActive: true,
      updatedAt: new Date(),
    });
  }

  deactivate(): SubscriptionPlan {
    if (!this.isActive) {
      throw new DomainError(SUBSCRIPTION_ERRORS.PLAN_ALREADY_INACTIVE);
    }
    return new SubscriptionPlan({
      ...this.props,
      isActive: false,
      updatedAt: new Date(),
    });
  }

  markPopular(): SubscriptionPlan {
    return new SubscriptionPlan({
      ...this.props,
      isPopular: true,
      updatedAt: new Date(),
    });
  }
  unmarkPopular(): SubscriptionPlan {
    return new SubscriptionPlan({
      ...this.props,
      isPopular: false,
      updatedAt: new Date(),
    });
  }
  isHigherThan(other: SubscriptionPlan): boolean {
    const rank = {
      free: 0,
      basic: 1,
      pro: 2,
      enterprise: 3,
    };
    return rank[this.planType] > rank[other.planType];
  }
  canUpgradeTo(target: SubscriptionPlan): boolean {
    return target.isHigherThan(this);
  }
  canDowngradeTo(target: SubscriptionPlan): boolean {
    return this.isHigherThan(target);
  }
  update(changes: Partial<SubscriptionPlanProps>): SubscriptionPlan {
    return SubscriptionPlan.create({
      ...this.props,
      ...changes,
      featuresAccess: {
        ...this.props.featuresAccess,
        ...(changes.featuresAccess ?? {}),
      },
      features: changes.features ?? this.props.features,
      updatedAt: new Date(),
    });
  }
  toObject(): SubscriptionPlanProps {
    return {
      ...this.props,
      featuresAccess: {
        ...this.props.featuresAccess,
      },
      features: [...this.props.features],
    };
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
