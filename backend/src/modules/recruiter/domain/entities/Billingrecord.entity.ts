// ─────────────────────────────────────────────────────────────────────────────
// Domain Entity – BillingRecord
// Immutable snapshot of a payment event (invoice / charge).
// ─────────────────────────────────────────────────────────────────────────────

export enum BillingStatus {
  Paid = "paid",
  Failed = "failed",
  Refunded = "refunded",
  Pending = "pending",
  PartiallyRefunded = "partially_refunded",
}

export enum BillingEventType {
  Subscription = "subscription",
  Upgrade = "upgrade",
  Downgrade = "downgrade",
  Renewal = "renewal",
  Refund = "refund",
  Cancellation = "cancellation",
}

export interface BillingRecordProps {
  id: string;
  recruiterId: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  tax?: number;
  discount?: number;
  netAmount: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpayInvoiceId?: string;
  invoiceUrl?: string;
  eventType: BillingEventType;
  status: BillingStatus;
  failureReason?: string;
  periodStart: Date;
  periodEnd: Date;
  paidAt?: Date;
  createdAt: Date;
}

export class BillingRecord {
  private constructor(private readonly props: BillingRecordProps) {}

  static create(props: BillingRecordProps): BillingRecord {
    if (props.amount < 0) throw new Error("Billing amount cannot be negative.");
    return new BillingRecord(props);
  }

 get id(): string {
    return this.props.id;
  }
  get recruiterId(): string {
    return this.props.recruiterId;
  }
  get subscriptionId(): string {
    return this.props.subscriptionId;
  }
  get planId(): string {
    return this.props.planId;
  }
  get planName(): string {
    return this.props.planName;
  }
  get amount(): number {
    return this.props.amount;
  }
  get currency(): string {
    return this.props.currency;
  }
  get tax(): number | undefined {
    return this.props.tax;
  }
  get discount(): number | undefined {
    return this.props.discount;
  }
  get netAmount(): number {
    return this.props.netAmount;
  }
  get razorpayPaymentId(): string | undefined {
    return this.props.razorpayPaymentId;
  }
  get razorpayOrderId(): string | undefined {
    return this.props.razorpayOrderId;
  }
  get razorpayInvoiceId(): string | undefined {
    return this.props.razorpayInvoiceId;
  }
  get invoiceUrl(): string | undefined {
    return this.props.invoiceUrl;
  }
  get eventType(): BillingEventType {
    return this.props.eventType;
  }
  get status(): BillingStatus {
    return this.props.status;
  }
  get failureReason(): string | undefined {
    return this.props.failureReason;
  }
  get periodStart(): Date {
    return this.props.periodStart;
  }
  get periodEnd(): Date {
    return this.props.periodEnd;
  }
  get paidAt(): Date | undefined {
    return this.props.paidAt;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

   get isPaid(): boolean {
    return this.props.status === BillingStatus.Paid;
  }
  get isFailed(): boolean {
    return this.props.status === BillingStatus.Failed;
  }
  get isRefunded(): boolean {
    return (
      this.props.status === BillingStatus.Refunded ||
      this.props.status === BillingStatus.PartiallyRefunded
    );
  }

  formattedAmount(): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: this.props.currency,
    }).format(this.props.netAmount / 100); 
  }

  toPlainObject(): BillingRecordProps {
    return { ...this.props };
  }
}
