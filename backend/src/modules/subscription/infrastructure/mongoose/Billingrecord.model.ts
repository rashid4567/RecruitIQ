import { Schema, model, Document, Types } from "mongoose";
import {
  BillingEventType,
  BillingStatus,
} from "../../../recruiter/domain/entities/Billingrecord.entity";

export interface IBillingRecord extends Document {
  recruiterId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  planId: Types.ObjectId;
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

const billingRecordSchema = new Schema<IBillingRecord>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterSubscription",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP"],
      required: true,
    },
    tax: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
    },
    netAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    razorpayInvoiceId: {
      type: String,
      trim: true,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    eventType: {
      type: String,
      enum: Object.values(BillingEventType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BillingStatus),
      required: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

billingRecordSchema.index({ recruiterId: 1, createdAt: -1 });
billingRecordSchema.index({ recruiterId: 1, status: 1 });
billingRecordSchema.index({ subscriptionId: 1 });
billingRecordSchema.index({ recruiterId: 1, eventType: 1 });
billingRecordSchema.index({ periodEnd: 1 });

export const BillingRecordModel = model<IBillingRecord>(
  "BillingRecord",
  billingRecordSchema,
);
