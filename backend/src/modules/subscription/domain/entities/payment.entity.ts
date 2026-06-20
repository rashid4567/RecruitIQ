import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
}

export enum PaymentType {
  Subscription = "subscription",
  Upgrade = "upgrade",
  Renewal = "renewal",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export interface PaymentProps {
  id: string;
  recruiterId: string;
  planId: string;
  durationMonths: number;
  subscriptionId?: string;
  paymentType: PaymentType;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment {
  private constructor(private readonly props: PaymentProps) {}
  static create(props: PaymentProps): Payment {
    if (props.amount <= 0) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_AMOUNT);
    }
    if (props.durationMonths < 1 || props.durationMonths > 12) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_SUBSCRIPTION_DURATION);
    }

    return new Payment(props);
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
  get subscriptionId() {
    return this.props.subscriptionId;
  }
  get paymentType() {
    return this.props.paymentType;
  }
  get amount() {
    return this.props.amount;
  }
  get currency() {
    return this.props.currency;
  }

  get durationMonths() {
    return this.props.durationMonths;
  }
  get status() {
    return this.props.status;
  }
  get razorpayOrderId() {
    return this.props.razorpayOrderId;
  }
  get razorpayPaymentId() {
    return this.props.razorpayPaymentId;
  }
  get paidAt() {
    return this.props.paidAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  isPaid(): boolean {
    return this.status === PaymentStatus.Paid;
  }
  isPending(): boolean {
    return this.status === PaymentStatus.Pending;
  }
  isFailed(): boolean {
    return this.status === PaymentStatus.Failed;
  }
  markPaid(razorpayPaymentId: string): Payment {
    return new Payment({
      ...this.props,
      razorpayPaymentId,
      status: PaymentStatus.Paid,
      paidAt: new Date(),
      updatedAt: new Date(),
    });
  }
  markFailed(reason: string): Payment {
    return new Payment({
      ...this.props,
      status: PaymentStatus.Failed,
      failureReason: reason,
      updatedAt: new Date(),
    });
  }
  attachSubscription(subscriptionId: string): Payment {
    return new Payment({
      ...this.props,
      subscriptionId,
      updatedAt: new Date(),
    });
  }
  toObject(): PaymentProps {
    return {
      ...this.props,
    };
  }
}
