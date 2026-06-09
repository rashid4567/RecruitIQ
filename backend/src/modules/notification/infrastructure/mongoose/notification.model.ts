import { Schema, model, Types } from "mongoose";

export enum RecipientRole {
  RECRUITER = "recruiter",
  CANDIDATE = "candidate",
}

export enum NotificationType {
  JOB_APPLIED = "JOB_APPLIED",
  APPLICATION_SHORTLISTED = "APPLICATION_SHORTLISTED",
  APPLICATION_REJECTED = "APPLICATION_REJECTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  INTERVIEW_CANCELLED = "INTERVIEW_CANCELLED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
  SUBSCRIPTION_RENEWED = "SUBSCRIPTION_RENEWED",
  RECRUITER_VERIFIED = "RECRUITER_VERIFIED",
  RECRUITER_REJECTED = "RECRUITER_REJECTED",
  JOB_APPROVED = "JOB_APPROVED",
  JOB_REJECTED = "JOB_REJECTED",
  APPLICATION_SELECTED = "APPLICATION_SELECTED",
}

const NotificationSchema = new Schema(
  {
    recipientId: {
      type: Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
    },

    recipientRole: {
      type: String,
      enum: Object.values(RecipientRole),
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    referenceId: {
      type: Types.ObjectId,
      default: null,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

NotificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

export const NotificationModel = model(
  "Notification",
  NotificationSchema
);