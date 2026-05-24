import { Schema, model, Document, Types } from "mongoose";

import {
  CancellationReason,
  SubscriptionStatus,
} from "../../../domain/entities/Recruitersubscription.entity";

enum PlanType {
  Free = "free",
  Basic = "basic",
  Pro = "pro",
  Enterprise = "enterprise",
}

enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

enum BillingCycle {
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

export interface IRecruiterSubscription extends Document {
  recruiterId: Types.ObjectId;
  planId: Types.ObjectId;
  planName: string;
  planType: PlanType;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
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
  jobPostsLimit: number;
  screeningCreditsLimit: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const recruiterSubscriptionSchema = new Schema<IRecruiterSubscription>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
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

    planType: {
      type: String,
      enum: Object.values(PlanType),
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
    },

    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
      required: true,
    },

    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpayCustomerId: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
    trialEndDate: {
      type: Date,
    },
    renewsAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },

    cancellationReason: {
      type: String,
      enum: Object.values(CancellationReason),
    },
    cancellationNote: {
      type: String,
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },

    jobPostsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    screeningCreditsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    jobPostsLimit: {
      type: Number,
      required: true,
    },

    screeningCreditsLimit: {
      type: Number,
      required: true,
    },

    currentPeriodStart: {
      type: Date,
      required: true,
    },

    currentPeriodEnd: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

recruiterSubscriptionSchema.index(
  { recruiterId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "active",
    },
  },
);

recruiterSubscriptionSchema.index({
  recruiterId: 1,
  status: 1,
});

recruiterSubscriptionSchema.index({
  status: 1,
  endDate: 1,
});

export const RecruiterSubscriptionModel = model<IRecruiterSubscription>(
  "RecruiterSubscription",
  recruiterSubscriptionSchema,
);
