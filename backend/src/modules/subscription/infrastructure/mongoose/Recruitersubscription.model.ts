import { Schema, model, Document, Types } from "mongoose";

export enum SubscriptionStatus {
  Active = "active",
  Cancelled = "cancelled",
  Expired = "expired",
}

export interface IRecruiterSubscription extends Document {
  recruiterId: Types.ObjectId;
  planId: Types.ObjectId;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  cancelledAt?: Date;
  jobPostsUsed: number;
  screeningUsed: number;
  resumeUsed: number;
  aiScoreUsed: number;
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
