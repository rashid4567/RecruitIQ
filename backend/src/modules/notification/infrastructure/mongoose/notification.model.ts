import { Schema, model, Types, HydratedDocument } from "mongoose";

export enum RecipientRole {
  RECRUITER = "recruiter",
  CANDIDATE = "candidate",
}

export enum NotificationType {
  JOB_APPLIED = "JOB_APPLIED",
  APPLICATION_SHORTLISTED = "APPLICATION_SHORTLISTED",
  APPLICATION_REJECTED = "APPLICATION_REJECTED",
  APPLICATION_SELECTED = "APPLICATION_SELECTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  INTERVIEW_STARTED = "INTERVIEW_STARTED",
  INTERVIEW_CANCELLED = "INTERVIEW_CANCELLED",
  INTERVIEW_RESCHEDULED = "INTERVIEW_RESCHEDULED",
  INTERVIEW_ACCEPTED = "INTERVIEW_ACCEPTED",
  INTERVIEW_DECLINED = "INTERVIEW_DECLINED",
  INTERVIEW_RESCHEDULE_REQUESTED = "INTERVIEW_RESCHEDULE_REQUESTED",
  INTERVIEW_RESCHEDULE_REQUEST_APPROVED = "INTERVIEW_RESCHEDULE_REQUEST_APPROVED",
  INTERVIEW_RESCHEDULE_REQUEST_REJECTED = "INTERVIEW_RESCHEDULE_REQUEST_REJECTED",
  OFFER_SENT = "OFFER_SENT",
  OFFER_ACCEPTED = "OFFER_ACCEPTED",
  OFFER_REJECTED = "OFFER_REJECTED",
  RECRUITER_REJECTED = "RECRUITER_REJECTED",
  RECRUITER_VERIFIED = "RECRUITER_VERIFIED",
  SUBSCRIPTION_UPGRADED = "SUBSCRIPTION_UPGRADED",
  SUBSCRIPTION_CREATED = "SUBSCRIPTION_CREATED",
}


export interface NotificationDocument {
  recipientId: Types.ObjectId;
  recipientRole: RecipientRole;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: Date | null;
  actionUrl?: string;
  referenceId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationDoc = HydratedDocument<NotificationDocument>;

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
  },
);

NotificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

export const NotificationModel = model("Notification", NotificationSchema);
