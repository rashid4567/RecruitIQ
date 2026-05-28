import { DomainError } from "../../../../shared/errors/domain.error";
import { PAYMENT_ERRORS } from "../error/payment.codes";

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
  Refunded = "refunded",
  PartiallyRefunded = "partially_refunded",
}

export enum PaymentType {
  Subscription = "subscription",
  Renewal = "renewal",
  Upgrade = "upgrade",
  Downgrade = "downgrade",
  Refund = "refund",
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

  subscriptionId?: string;

  planId?: string;

  paymentType: PaymentType;

  amount: number;

  tax: number;

  discount: number;

  netAmount: number;

  currency: Currency;

  status: PaymentStatus;

  paymentMethod?: string;

  razorpayOrderId?: string;

  razorpayPaymentId?: string;

  razorpayInvoiceId?: string;

  invoiceUrl?: string;

  failureReason?: string;

  paidAt?: Date;

  refundedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export class Payment {

  private constructor(
    private readonly props: PaymentProps,
  ) {}

  static create(
    props: PaymentProps,
  ): Payment {

    if (props.amount < 0) {
      throw new DomainError(
        PAYMENT_ERRORS.INVALID_AMOUNT,
      );
    }

    const expectedNet =
      props.amount +
      props.tax -
      props.discount;

    if (
      props.netAmount !==
      expectedNet
    ) {
      throw new DomainError(
        PAYMENT_ERRORS.INVALID_NET_AMOUNT,
      );
    }

    return new Payment(props);
  }

  get id() {
    return this.props.id;
  }

  get recruiterId() {
    return this.props.recruiterId;
  }

  get subscriptionId() {
    return this.props.subscriptionId;
  }

  get planId() {
    return this.props.planId;
  }

  get amount() {
    return this.props.amount;
  }

  get tax() {
    return this.props.tax;
  }

  get discount() {
    return this.props.discount;
  }

  get netAmount() {
    return this.props.netAmount;
  }

  get status() {
    return this.props.status;
  }

  get paymentType() {
    return this.props.paymentType;
  }

  isPaid() {
    return (
      this.status ===
      PaymentStatus.Paid
    );
  }

  isFailed() {
    return (
      this.status ===
      PaymentStatus.Failed
    );
  }

  markPaid(
    razorpayPaymentId: string,
  ): Payment {

    return new Payment({
      ...this.props,

      razorpayPaymentId,

      status:
        PaymentStatus.Paid,

      paidAt: new Date(),

      updatedAt:
        new Date(),
    });
  }

  markFailed(
    reason: string,
  ): Payment {

    return new Payment({
      ...this.props,

      status:
        PaymentStatus.Failed,

      failureReason:
        reason,

      updatedAt:
        new Date(),
    });
  }

  refund(): Payment {

    return new Payment({
      ...this.props,

      status:
        PaymentStatus.Refunded,

      refundedAt:
        new Date(),

      updatedAt:
        new Date(),
    });
  }

  toObject(): PaymentProps {
    return {
      ...this.props,
    };
  }
}