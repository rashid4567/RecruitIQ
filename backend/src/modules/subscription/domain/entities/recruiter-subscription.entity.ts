import { DomainError } from "../../../../shared/errors/domain.error";
import { SUBSCRIPTION_ERRORS } from "../error/error.codes";
import { PlanType } from "./subscription-plan.entity";

export enum SubscriptionStatus {
  Active = "active",
  Cancelled = "cancelled",
  Expired = "expired",
}

export interface RecruiterSubscriptionProps {
  id: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: PlanType;
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
  private constructor(private readonly props: RecruiterSubscriptionProps) {}
  static create(props: RecruiterSubscriptionProps): RecruiterSubscription {
    if (!props.planName.trim()) {
      throw new DomainError(SUBSCRIPTION_ERRORS.PLAN_NAME_IS_REQUIRED);
    }
    if (props.planPrice < 0) {
      throw new DomainError(SUBSCRIPTION_ERRORS.PRICE_CANNOT_BE_NEGATIVE);
    }
    if (props.endDate <= props.startDate) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_SUBSCRIPTION_PERIOD);
    }
    if (props.currentPeriodEnd <= props.currentPeriodStart) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_SUBSCRIPTION_PERIOD);
    }
    if (
      props.jobPostsUsed < 0 ||
      props.screeningUsed < 0 ||
      props.resumeUsed < 0 ||
      props.aiScoreUsed < 0
    ) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_JOB_USAGE);
    }
    if (
      props.jobPostsLimit < -1 ||
      props.screeningLimit < -1 ||
      props.resumeLimit < -1 ||
      props.aiScoreLimit < -1
    ) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_JOB_POST_LIMIT);
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
  isActive(): boolean {
    return this.status === SubscriptionStatus.Active;
  }
  isCancelled(): boolean {
    return this.status === SubscriptionStatus.Cancelled;
  }
  isExpired(): boolean {
    return (
      this.status === SubscriptionStatus.Expired || new Date() > this.endDate
    );
  }
  hasJobPostAccess(): boolean {
    return this.jobPostsLimit === -1 || this.jobPostsUsed < this.jobPostsLimit;
  }
  hasScreeningAccess(): boolean {
    return (
      this.screeningLimit === -1 || this.screeningUsed < this.screeningLimit
    );
  }
  hasResumeAccess(): boolean {
    return this.resumeLimit === -1 || this.resumeUsed < this.resumeLimit;
  }
  hasAIScoreAccess(): boolean {
    return this.aiScoreLimit === -1 || this.aiScoreUsed < this.aiScoreLimit;
  }
  consumeJobPost() {
    if (!this.hasJobPostAccess()) {
      throw new DomainError(SUBSCRIPTION_ERRORS.JOB_LIMIT_EXCEEDED);
    }
    return new RecruiterSubscription({
      ...this.props,
      jobPostsUsed: this.jobPostsUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeScreening() {
    if (!this.hasScreeningAccess()) {
      throw new DomainError(SUBSCRIPTION_ERRORS.SCREENING_LIMIT_EXCEEDED);
    }
    return new RecruiterSubscription({
      ...this.props,
      screeningUsed: this.screeningUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeResume() {
    if (!this.hasResumeAccess()) {
      throw new DomainError(SUBSCRIPTION_ERRORS.RESUME_LIMIT_EXCEEDED);
    }
    return new RecruiterSubscription({
      ...this.props,
      resumeUsed: this.resumeUsed + 1,
      updatedAt: new Date(),
    });
  }
  consumeAIScore() {
    if (!this.hasAIScoreAccess()) {
      throw new DomainError(SUBSCRIPTION_ERRORS.AI_SCORE_LIMIT_EXCEEDED);
    }
    return new RecruiterSubscription({
      ...this.props,
      aiScoreUsed: this.aiScoreUsed + 1,
      updatedAt: new Date(),
    });
  }
  resetUsage(nextPeriodStart: Date, nextPeriodEnd: Date) {
    return new RecruiterSubscription({
      ...this.props,
      currentPeriodStart: nextPeriodStart,
      currentPeriodEnd: nextPeriodEnd,
      jobPostsUsed: 0,
      screeningUsed: 0,
      resumeUsed: 0,
      aiScoreUsed: 0,
      updatedAt: new Date(),
    });
  }
  renew(newEndDate: Date, nextPeriodStart: Date, nextPeriodEnd: Date) {
    if (newEndDate <= this.endDate) {
      throw new DomainError(SUBSCRIPTION_ERRORS.INVALID_RENEWAL_DATE);
    }

    return new RecruiterSubscription({
      ...this.props,
      endDate: newEndDate,
      currentPeriodStart: nextPeriodStart,
      currentPeriodEnd: nextPeriodEnd,
      status: SubscriptionStatus.Active,
      cancelledAt: undefined,
      updatedAt: new Date(),
    });
  }
  cancel() {
    if (this.isCancelled()) {
      throw new DomainError(SUBSCRIPTION_ERRORS.ALREADY_CANCELLED);
    }
    return new RecruiterSubscription({
      ...this.props,
      status: SubscriptionStatus.Cancelled,
      cancelledAt: new Date(),
      autoRenew: false,
      updatedAt: new Date(),
    });
  }
  expire() {
    return new RecruiterSubscription({
      ...this.props,
      status: SubscriptionStatus.Expired,
      autoRenew: false,
      updatedAt: new Date(),
    });
  }
  enableAutoRenew() {
    return new RecruiterSubscription({
      ...this.props,
      autoRenew: true,
      updatedAt: new Date(),
    });
  }
  disableAutoRenew() {
    return new RecruiterSubscription({
      ...this.props,
      autoRenew: false,
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
  toObject(): RecruiterSubscriptionProps {
    return {
      ...this.props,
    };
  }
}
