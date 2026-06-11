import { Schema, model, Document, Types } from "mongoose";


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

export interface IPayment extends Document {
  recruiterId: Types.ObjectId;
  planId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  paymentType: PaymentType;
  amount: number;
  currency: Currency;
  durationMonths: number;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
      index: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
      index: true,
    },

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterSubscription",
    },

    paymentType: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
      default: PaymentType.Subscription,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
      default: Currency.INR,
    },

    durationMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.Pending,
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    failureReason: {
      type: String,
      maxlength: 500,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({
  recruiterId: 1,
  createdAt: -1,
});

paymentSchema.index({
  status: 1,
  createdAt: -1,
});

paymentSchema.index({
  subscriptionId: 1,
});

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
