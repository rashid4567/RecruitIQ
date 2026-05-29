export const PaymentStatus = {
  Pending: "pending",
  Paid: "paid",
  Failed: "failed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentType = {
  Subscription: "subscription",
  Renewal: "renewal",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export interface PaymentProps {
  id: string;
  recruiterId: string;
  planId: string;
  subscriptionId?: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment {
  private readonly props: PaymentProps;
  constructor(props: PaymentProps) {
    this.props = props;
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

  get isPaid() {
    return this.status === PaymentStatus.Paid;
  }

  get isPending() {
    return this.status === PaymentStatus.Pending;
  }

  get isFailed() {
    return this.status === PaymentStatus.Failed;
  }

  toPlainObject(): PaymentProps {
    return {
      ...this.props,
    };
  }
}
