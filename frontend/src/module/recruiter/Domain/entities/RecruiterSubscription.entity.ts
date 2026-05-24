import {
  SubscriptionStatus,
  type CancellationReason,
} from "../constatns/subscription.constants";

interface UsageSnapShot {
  jobPostsUsed: number;
  screeningCreditsUsed: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface RecruiterSubscriptionProps {
  id: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planType: string;
  price: number;
  currency: string;
  billingCycle: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpayCustomerId?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  trialEndDate?: Date;
  cancelledAt?: Date;
  cancellationReason?: CancellationReason;
  cancellationNote?: string;
  renewsAt?: Date;
  autoRenew: boolean;
  jobPostsUsed: number;
  screeningCreditsUsed: number;
  jobPostsLimit: number;
  screeningCreditsLimit: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class RecruiterSubscription {
  private readonly props: RecruiterSubscriptionProps;
  private constructor(props: RecruiterSubscriptionProps) {
    this.props = props;
  }
  static create(props: RecruiterSubscriptionProps): RecruiterSubscription {
    return new RecruiterSubscription(props);
  }
  get id(): string {
    return this.props.id;
  }
  get recruiterId(): string {
    return this.props.recruiterId;
  }
  get planId(): string {
    return this.props.planId;
  }
  get planName(): string {
    return this.props.planName;
  }
  get planType(): string {
    return this.props.planType;
  }
  get price(): number {
    return this.props.price;
  }
  get currency(): string {
    return this.props.currency;
  }
  get billingCycle(): string {
    return this.props.billingCycle;
  }
  get razorpayOrderId(): string | undefined {
    return this.props.razorpayOrderId;
  }
  get razorpayPaymentId(): string | undefined {
    return this.props.razorpayPaymentId;
  }
  get razorpayCustomerId(): string | undefined {
    return this.props.razorpayCustomerId;
  }
  get status(): SubscriptionStatus {
    return this.props.status;
  }
  get startDate(): Date {
    return this.props.startDate;
  }
  get endDate(): Date {
    return this.props.endDate;
  }
  get trialEndDate(): Date | undefined {
    return this.props.trialEndDate;
  }
  get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }
  get cancellationReason(): CancellationReason | undefined {
    return this.props.cancellationReason;
  }
  get cancellationNote(): string | undefined {
    return this.props.cancellationNote;
  }
  get renewsAt(): Date | undefined {
    return this.props.renewsAt;
  }
  get autoRenew(): boolean {
    return this.props.autoRenew;
  }
  get jobPostsUsed(): number {
    return this.props.jobPostsUsed;
  }
  get screeningCreditsUsed(): number {
    return this.props.screeningCreditsUsed;
  }
  get jobPostsLimit(): number {
    return this.props.jobPostsLimit;
  }
  get screeningCreditsLimit(): number {
    return this.props.screeningCreditsLimit;
  }
  get currentPeriodStart(): Date {
    return this.props.currentPeriodStart;
  }
  get currentPeriodEnd(): Date {
    return this.props.currentPeriodEnd;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isActive(): boolean {
    return (
      this.props.status === SubscriptionStatus.Active ||
      this.props.status === SubscriptionStatus.Trialing
    );
  }

  get isExpired(): boolean {
    return (
      this.props.endDate < new Date() ||
      this.props.status === SubscriptionStatus.Expired
    );
  }

  get isCancelled(): boolean {
    return this.props.status === SubscriptionStatus.Cancelled;
  }

  get isInTrial(): boolean {
    if (!this.props.trialEndDate) {
      return false;
    }
    return (
      this.props.status === SubscriptionStatus.Trialing &&
      this.props.trialEndDate > new Date()
    );
  }
  get remainingJobPosts(): number | "unlimited" {
    if (this.props.jobPostsLimit === -1) {
      return "unlimited";
    }
    return Math.max(
      0,
      this.props.jobPostsLimit - this.props.jobPostsUsed,
    );
  }
  get remainingScreeningCredits(): number | "unlimited" {
    if (this.props.screeningCreditsLimit === -1) {
      return "unlimited";
    }
    return Math.max(
      0,
      this.props.screeningCreditsLimit - this.props.screeningCreditsUsed,
    );
  }

  get jobPostUsagePercent(): number {
    if (this.props.jobPostsLimit === -1) {
      return 0;
    }
    if (this.props.jobPostsLimit === 0) {
      return 100;
    }
    return Math.min(
      100,
      (this.props.jobPostsUsed / this.props.jobPostsLimit) * 100,
    );
  }
  get screeningCreditUsagePercent(): number {
    if (this.props.screeningCreditsLimit === -1) {
      return 0;
    }

    if (this.props.screeningCreditsLimit === 0) {
      return 100;
    }

    return Math.min(
      100,
      (this.props.screeningCreditsUsed / this.props.screeningCreditsLimit) *
        100,
    );
  }

  get daysUntilExpiry(): number {
    const now = new Date();
    const diff = this.props.endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  get isExpiringSoon(): boolean {
    return this.isActive && this.daysUntilExpiry <= 7;
  }
  canPostJob(): boolean {
    if (!this.isActive) {
      return false;
    }
    if (this.props.jobPostsLimit === -1) {
      return true;
    }
    return this.props.jobPostsUsed < this.props.jobPostsLimit;
  }

  canUseScreeningCredit(): boolean {
    if (!this.isActive) {
      return false;
    }
    if (this.props.screeningCreditsLimit === -1) {
      return true;
    }
    return this.props.screeningCreditsUsed < this.props.screeningCreditsLimit;
  }

  usageSnapshot(): UsageSnapShot {
    return {
      jobPostsUsed: this.props.jobPostsUsed,
      screeningCreditsUsed: this.props.screeningCreditsUsed,
      periodStart: this.props.currentPeriodStart,
      periodEnd: this.props.currentPeriodEnd,
    };
  }
  toPlainObject(): RecruiterSubscriptionProps {
    return {
      ...this.props,
    };
  }
}
