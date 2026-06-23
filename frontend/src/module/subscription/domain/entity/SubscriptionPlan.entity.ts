import type {
  BillingCycle,
  Currency,
  PlanType,
} from "../constant/subscription.constants";

export interface FeatureAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  aiResumeScoring: boolean;
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
  jobPostActiveDays: number;
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
  private readonly props: SubscriptionPlanProps;

  private constructor(props: SubscriptionPlanProps) {
    this.props = props;
  }

  static create(props: SubscriptionPlanProps): SubscriptionPlan {
    if (!props.id) {
      throw new Error("Plan id is required");
    }
    if (!props.name?.trim()) {
      throw new Error("Plan name is required");
    }
    return new SubscriptionPlan(props);
  }
  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get planType() {
    return this.props.planType;
  }
  get price() {
    return this.props.price;
  }
  get currency() {
    return this.props.currency;
  }
  get billingCycle() {
    return this.props.billingCycle;
  }
  get billingInterval() {
    return this.props.billingInterval;
  }
  get jobPostsPerMonth() {
    return this.props.jobPostsPerMonth;
  }
  get screeningCredits() {
    return this.props.screeningCredits;
  }
get resumeParsesPerMonth() {
  return this.props.resumeParsesPerMonth;
}
  get aiScoreCredits() {
    return this.props.aiScoreCredits;
  }
  get jobPostActiveDays() {
    return this.props.jobPostActiveDays;
  }
  get featuresAccess() {
    return {
      ...this.props.featuresAccess,
    };
  }
  get features() {
    return [...this.props.features];
  }
  get isPopular() {
    return this.props.isPopular;
  }
  get sortOrder() {
    return this.props.sortOrder;
  }
  get isActive() {
    return this.props.isActive;
  }
  get razorpayPlanId() {
    return this.props.razorpayPlanId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get isFree() {
    return this.props.planType === "free";
  }
  get isPaid() {
    return !this.isFree;
  }
  get hasUnlimitedJobs() {
    return this.props.jobPostsPerMonth === -1;
  }
  get hasUnlimitedScreening() {
    return this.props.screeningCredits === -1;
  }

  get displayJobPostDuration() {
    return `${this.jobPostActiveDays} days`;
  }
  get hasUnlimitedAIScoring() {
    return this.props.aiScoreCredits === -1;
  }
  supportsInterview() {
    return this.props.featuresAccess.interviewScheduling;
  }
  supportsAnalytics() {
    return this.props.featuresAccess.advancedAnalytics;
  }
  supportsPriority() {
    return this.props.featuresAccess.prioritySupport;
  }

  supportsAIScoring() {
    return this.props.featuresAccess.aiResumeScoring;
  }
  supportsCandidateShortlisting() {
    return this.props.featuresAccess.candidateShortlisting;
  }
  supportsExportReports() {
    return this.props.featuresAccess.exportReports;
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
  get displayPrice() {
    if (this.isFree) {
      return "Free";
    }
    return `${this.currency} ${this.price.toLocaleString()}`;
  }
  get displayJobs() {
    return this.hasUnlimitedJobs ? "Unlimited" : String(this.jobPostsPerMonth);
  }
  get displayScreening() {
    return this.hasUnlimitedScreening
      ? "Unlimited"
      : String(this.screeningCredits);
  }

  get displayAIScoreCredits() {
    return this.hasUnlimitedAIScoring
      ? "Unlimited"
      : String(this.aiScoreCredits);
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
