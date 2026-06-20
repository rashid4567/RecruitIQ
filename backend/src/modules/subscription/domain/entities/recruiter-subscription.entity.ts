import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";
import { PlanType } from "./subscription-plan.entity";

export enum SubscriptionStatus {
  Active = "active",
  Cancelled = "cancelled",
  Expired = "expired",
}

export interface RecruiterSubscriptionProps {
  id?: string;
  recruiterId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: PlanType;
  jobPostActiveDays: number;
  paymentReferenceId?: string;
  durationMonths: number;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  autoRenew: boolean;
  cancelledAt?: Date;
  jobPostsUsed: number;
  screeningUsed: number;
  aiScoreUsed: number;
  jobPostsLimit: number;
  screeningLimit: number;
  aiScoreLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export class RecruiterSubscription {
  private constructor(private readonly props: RecruiterSubscriptionProps) {}

  static create(props: RecruiterSubscriptionProps): RecruiterSubscription {
    if (!props.planName?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.PLAN_NAME_IS_REQUIRED);
    }

    if (props.planPrice < 0) {
      throw new DomainError(DOMAIN_ERROR_CODES.PRICE_CANNOT_BE_NEGATIVE);
    }

    if (props.endDate <= props.startDate) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_SUBSCRIPTION_PERIOD);
    }

    if (props.jobPostActiveDays < 1) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_JOB_POST_ACTIVE_DAYS);
    }

    if (props.currentPeriodEnd <= props.currentPeriodStart) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_SUBSCRIPTION_PERIOD);
    }
    if (props.durationMonths < 1 || props.durationMonths > 12) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_SUBSCRIPTION_DURATION);
    }

    if (
      props.jobPostsUsed < 0 ||
      props.screeningUsed < 0 ||
      props.aiScoreUsed < 0
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_JOB_USAGE);
    }

    if (
      props.jobPostsLimit < -1 ||
      props.screeningLimit < -1 ||
      props.aiScoreLimit < -1
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_JOB_POST_LIMIT);
    }

    return new RecruiterSubscription(props);
  }

  get id() {
    return this.props.id ?? "";
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
  get jobPostActiveDays() {
    return this.props.jobPostActiveDays;
  }

  get paymentReferenceId() {
    return this.props.paymentReferenceId;
  }

  get status() {
    return this.props.status;
  }

  get durationMonths() {
    return this.props.durationMonths;
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

  get aiScoreUsed() {
    return this.props.aiScoreUsed;
  }

  get jobPostsLimit() {
    return this.props.jobPostsLimit;
  }

  get screeningLimit() {
    return this.props.screeningLimit;
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

  hasAIScoreAccess(): boolean {
    return this.aiScoreLimit === -1 || this.aiScoreUsed < this.aiScoreLimit;
  }

  consumeJobPost() {
    if (!this.hasJobPostAccess()) {
      throw new DomainError(DOMAIN_ERROR_CODES.JOB_LIMIT_EXCEEDED);
    }

    return new RecruiterSubscription({
      ...this.props,
      jobPostsUsed: this.jobPostsUsed + 1,
      updatedAt: new Date(),
    });
  }

  consumeScreening() {
    if (!this.hasScreeningAccess()) {
      throw new DomainError(DOMAIN_ERROR_CODES.SCREENING_LIMIT_EXCEEDED);
    }

    return new RecruiterSubscription({
      ...this.props,
      screeningUsed: this.screeningUsed + 1,
      updatedAt: new Date(),
    });
  }

  consumeAIScore() {
    if (!this.hasAIScoreAccess()) {
      throw new DomainError(DOMAIN_ERROR_CODES.AI_SCORE_LIMIT_EXCEEDED);
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
      aiScoreUsed: 0,
      updatedAt: new Date(),
    });
  }

  renew(newEndDate: Date, nextPeriodStart: Date, nextPeriodEnd: Date) {
    if (newEndDate <= this.endDate) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_RENEWAL_DATE);
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
      throw new DomainError(DOMAIN_ERROR_CODES.ALREADY_CANCELLED);
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
  toJSON() {
    return {
      ...this.props,
    };
  }
  toObject(): RecruiterSubscriptionProps {
    return {
      ...this.props,
    };
  }
}
