import {
  SubscriptionStatus,
  type CancellationReason,
} from "../dto/subscription.constants";

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
  resumeParsesUsed: number;
  aiScoresUsed: number;
  jobPostsLimit: number;
  screeningCreditsLimit: number;
  resumeParsesLimit: number;
  aiScoresLimit: number;
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
    if (props.endDate <= props.startDate) {
      throw new Error("Invalid subscription period");
    }
    return new RecruiterSubscription(props);
  }
  get id() {
    return this.props.id;
  }
  get recruiterId() {
    return this.props.recruiterId;
  }
  get planId() {
    return this.props.planId;
  }
  get status() {
    return this.props.status;
  }
  get startDate() {
    return this.props.startDate;
  }
  get endDate() {
    return this.props.endDate;
  }
  get autoRenew() {
    return this.props.autoRenew;
  }
  get jobPostsUsed() {
    return this.props.jobPostsUsed;
  }
  get screeningCreditsUsed() {
    return this.props.screeningCreditsUsed;
  }
  get resumeParsesUsed() {
    return this.props.resumeParsesUsed;
  }
  get aiScoresUsed() {
    return this.props.aiScoresUsed;
  }
  get jobPostsLimit() {
    return this.props.jobPostsLimit;
  }
  get screeningCreditsLimit() {
    return this.props.screeningCreditsLimit;
  }
  get resumeParsesLimit() {
    return this.props.resumeParsesLimit;
  }
  get aiScoresLimit() {
    return this.props.aiScoresLimit;
  }
  get isActive() {
    return (
      this.props.status === SubscriptionStatus.Active ||
      this.props.status === SubscriptionStatus.Trialing
    );
  }
  get isExpired() {
    return (
      new Date() > this.props.endDate ||
      this.props.status === SubscriptionStatus.Expired
    );
  }
  get isCancelled() {
    return this.props.status === SubscriptionStatus.Cancelled;
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
  canUseScreening(): boolean {
    if (!this.isActive) {
      return false;
    }
    if (this.props.screeningCreditsLimit === -1) {
      return true;
    }
    return this.props.screeningCreditsUsed < this.props.screeningCreditsLimit;
  }
  canUseResumeParsing(): boolean {
    if (!this.isActive) {
      return false;
    }
    if (this.props.resumeParsesLimit === -1) {
      return true;
    }
    return this.props.resumeParsesUsed < this.props.resumeParsesLimit;
  }

  canUseAIScore(): boolean {
    if (!this.isActive) {
      return false;
    }
    if (this.props.aiScoresLimit === -1) {
      return true;
    }
    return this.props.aiScoresUsed < this.props.aiScoresLimit;
  }
  consumeJobPost() {
    return new RecruiterSubscription({
      ...this.props,
      jobPostsUsed: this.props.jobPostsUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeScreening() {
    return new RecruiterSubscription({
      ...this.props,
      screeningCreditsUsed: this.props.screeningCreditsUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeResumeParsing() {
    return new RecruiterSubscription({
      ...this.props,
      resumeParsesUsed: this.props.resumeParsesUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeAIScore() {
    return new RecruiterSubscription({
      ...this.props,
      aiScoresUsed: this.props.aiScoresUsed + 1,
      updatedAt: new Date(),
    });
  }

  renew(newEndDate: Date): RecruiterSubscription {
    return new RecruiterSubscription({
      ...this.props,
      endDate: newEndDate,
      status: SubscriptionStatus.Active,
      cancelledAt: undefined,
      updatedAt: new Date(),
    });
  }
  cancel(reason?: CancellationReason, note?: string) {
    return new RecruiterSubscription({
      ...this.props,
      status: SubscriptionStatus.Cancelled,
      cancelledAt: new Date(),
      cancellationReason: reason,
      cancellationNote: note,
      autoRenew: false,
      updatedAt: new Date(),
    });
  }
  resetUsage() {
    return new RecruiterSubscription({
      ...this.props,
      jobPostsUsed: 0,
      screeningCreditsUsed: 0,
      resumeParsesUsed: 0,
      aiScoresUsed: 0,
      updatedAt: new Date(),
    });
  }
  update(changes: Partial<RecruiterSubscriptionProps>) {
    return RecruiterSubscription.create({
      ...this.props,
      ...changes,
      updatedAt: new Date(),
    });
  }
  toPlainObject(): RecruiterSubscriptionProps {
    return {
      ...this.props,
    };
  }
}
