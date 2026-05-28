import {
  PlanType,
  type BillingCycle,
  type Currency,
} from "../dto/subscription.constants";

export interface FeaturesAccess {
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
  featuresAccess: FeaturesAccess;
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
    const safeProps: SubscriptionPlanProps = {
      ...props,
      id: String(props.id ?? "").trim(),
      name: props.name ?? "",
      description: props.description,
      planType: props.planType ?? PlanType.Free,
      price: props.price ?? 0,
      currency: props.currency ?? ("INR" as Currency),
      billingCycle: props.billingCycle ?? ("monthly" as BillingCycle),
      billingInterval: props.billingInterval ?? 1,
      jobPostsPerMonth: props.jobPostsPerMonth ?? 0,
      screeningCredits: props.screeningCredits ?? 0,
      resumeParsesPerMonth: props.resumeParsesPerMonth ?? 0,
      aiScoreCredits: props.aiScoreCredits ?? 0,
      featuresAccess: props.featuresAccess ?? {
        interviewScheduling: false,
        advancedAnalytics: false,
        prioritySupport: false,
        aiResumeScoring: false,
        resumeParsing: false,
        candidateShortlisting: false,
        exportReports: false,
      },
      features: props.features ?? [],
      isPopular: props.isPopular ?? false,
      sortOrder: props.sortOrder ?? 0,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
    if (!safeProps.id) {
      throw new Error("Plan id missing from API response");
    }
    const entity = new SubscriptionPlan(safeProps);
    return entity;
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
    return this.props.planType === PlanType.Free || this.props.price === 0;
  }
  get hasUnlimitedJobs() {
    return this.props.jobPostsPerMonth === -1;
  }
  get hasUnlimitedScreening() {
    return this.props.screeningCredits === -1;
  }
  get hasUnlimitedResumeParses() {
    return this.props.resumeParsesPerMonth === -1;
  }
  get hasUnlimitedAIScoring() {
    return this.props.aiScoreCredits === -1;
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
  get displayResumeParses() {
    return this.hasUnlimitedResumeParses
      ? "Unlimited"
      : String(this.resumeParsesPerMonth);
  }
  get displayAIScoreCredits() {
    return this.hasUnlimitedAIScoring
      ? "Unlimited"
      : String(this.aiScoreCredits);
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
  supportsResumeParsing() {
    return this.props.featuresAccess.resumeParsing;
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

  isHigherThan(other: SubscriptionPlan) {
    const rank = {
      [PlanType.Free]: 0,
      [PlanType.Basic]: 1,
      [PlanType.Pro]: 2,
      [PlanType.Enterprise]: 3,
    };
    return rank[this.planType] > rank[other.planType];
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
