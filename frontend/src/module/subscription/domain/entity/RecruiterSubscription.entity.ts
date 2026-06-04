import { SubscriptionStatus } from "../constant/subscription.constants";
import type { PlanType } from "../constant/subscription.constants";

export interface RecruiterSubscriptionProps {
  id: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: PlanType;
  durationMonths: number;
  jobPostActiveDays: number;
  paymentReferenceId?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  autoRenew: boolean;
  cancelledAt?: Date;
  jobPostsUsed: number;
  screeningUsed: number;
  resumeUsed: number;
  aiScoreUsed: number;
  jobPostsLimit: number;
  screeningLimit: number;
  resumeLimit: number;
  aiScoreLimit: number;
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
  get planName() {
    return this.props.planName;
  }
  get planPrice() {
    return this.props.planPrice;
  }
  get planType() {
    return this.props.planType;
  }
  get durationMonths() {
  return this.props.durationMonths;
}
  get paymentReferenceId() {
    return this.props.paymentReferenceId;
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
  get jobPostActiveDays() {
    return this.props.jobPostActiveDays;
  }
  get currentPeriodStart() {
    return this.props.currentPeriodStart;
  }
  get currentPeriodEnd() {
    return this.props.currentPeriodEnd;
  }
  get autoRenew() {
    return this.props.autoRenew;
  }
  get cancelledAt() {
    return this.props.cancelledAt;
  }
  get jobPostsUsed() {
    return this.props.jobPostsUsed;
  }
  get screeningUsed() {
    return this.props.screeningUsed;
  }
  get resumeUsed() {
    return this.props.resumeUsed;
  }
  get aiScoreUsed() {
    return this.props.aiScoreUsed;
  }
  get jobPostsLimit() {
    return this.props.jobPostsLimit;
  }
  get screeningLimit() {
    return this.props.screeningLimit;
  }
  get resumeLimit() {
    return this.props.resumeLimit;
  }
  get aiScoreLimit() {
    return this.props.aiScoreLimit;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get isActive() {
    return this.props.status === SubscriptionStatus.Active;
  }
  get isCancelled() {
    return this.props.status === SubscriptionStatus.Cancelled;
  }
  get isExpired() {
    return (
      this.props.status === SubscriptionStatus.Expired ||
      new Date() > this.props.endDate
    );
  }
  get remainingJobPosts() {
  if (this.jobPostsLimit === -1) {
    return -1;
  }

  return this.jobPostsLimit - this.jobPostsUsed;
}

get remainingScreenings() {
  if (this.screeningLimit === -1) {
    return -1;
  }

  return this.screeningLimit - this.screeningUsed;
}

get remainingResumeParses() {
  if (this.resumeLimit === -1) {
    return -1;
  }

  return this.resumeLimit - this.resumeUsed;
}

get remainingAIScores() {
  if (this.aiScoreLimit === -1) {
    return -1;
  }

  return this.aiScoreLimit - this.aiScoreUsed;
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
    if (this.props.screeningLimit === -1) {
      return true;
    }
    return this.props.screeningUsed < this.props.screeningLimit;
  }
  canUseResume(): boolean {
    if (!this.isActive) {
      return false;
    }
    if (this.props.resumeLimit === -1) {
      return true;
    }
    return this.props.resumeUsed < this.props.resumeLimit;
  }
  canUseAIScore(): boolean {
    if (!this.isActive) {
      return false;
    }
    if (this.props.aiScoreLimit === -1) {
      return true;
    }
    return this.props.aiScoreUsed < this.props.aiScoreLimit;
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
      screeningUsed: this.props.screeningUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeResume() {
    return new RecruiterSubscription({
      ...this.props,
      resumeUsed: this.props.resumeUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeAIScore() {
    return new RecruiterSubscription({
      ...this.props,
      aiScoreUsed: this.props.aiScoreUsed + 1,
      updatedAt: new Date(),
    });
  }

  renew(newEndDate: Date) {
    return new RecruiterSubscription({
      ...this.props,
      endDate: newEndDate,
      status: SubscriptionStatus.Active,
      cancelledAt: undefined,
      updatedAt: new Date(),
    });
  }

  cancel() {
    return new RecruiterSubscription({
      ...this.props,
      status: SubscriptionStatus.Cancelled,
      cancelledAt: new Date(),
      autoRenew: false,
      updatedAt: new Date(),
    });
  }

  resetUsage() {
    return new RecruiterSubscription({
      ...this.props,
      jobPostsUsed: 0,
      screeningUsed: 0,
      resumeUsed: 0,
      aiScoreUsed: 0,
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
