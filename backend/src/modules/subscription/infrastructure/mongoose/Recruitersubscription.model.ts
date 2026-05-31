import { Schema, model, Document, Types } from "mongoose";

export enum SubscriptionStatus {
  Active = "active",
  Cancelled = "cancelled",
  Expired = "expired",
}

export interface IRecruiterSubscription extends Document {
  recruiterId: Types.ObjectId;
  planId: Types.ObjectId;
  planName: string;
  planPrice: number;
  planType: string;
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

    planPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    planType: {
      type: String,
      required: true,
    },
    jobPostActiveDays: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentReferenceId: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
      default: SubscriptionStatus.Active,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
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

    autoRenew: {
      type: Boolean,
      default: false,
    },

    cancelledAt: {
      type: Date,
    },

    jobPostsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    screeningUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    resumeUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    aiScoreUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    jobPostsLimit: {
      type: Number,
      required: true,
      min: -1,
    },

    screeningLimit: {
      type: Number,
      required: true,
      min: -1,
    },

    resumeLimit: {
      type: Number,
      required: true,
      min: -1,
    },

    aiScoreLimit: {
      type: Number,
      required: true,
      min: -1,
    },
  },
  {
    timestamps: true,
  },
);

recruiterSubscriptionSchema.index(
  {
    recruiterId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: SubscriptionStatus.Active,
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
