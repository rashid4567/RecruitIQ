import mongoose, { Document, Schema } from "mongoose";

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  RESCHEDULED = "RESCHEDULED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum InterviewMode {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export interface InterviewDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  roomId?: string;
  round: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  status: InterviewStatus;
  scheduledAt: Date;
  durationInMinutes: number;
  location?: string;
  meetingLink?: string;
  startedAt?: Date;
  endedAt?: Date;
  recruiterJoinedAt?: Date;
  candidateJoinedAt?: Date;
  notes?: string;
  cancelledReason?: string;
  cancelledBy?: mongoose.Types.ObjectId;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<InterviewDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "JobApplication",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
      index: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
      index: true,
    },
    round: {
      type: Number,
      default: 1,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    mode: {
      type: String,
      enum: Object.values(InterviewMode),
      default: InterviewMode.ONLINE,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.SCHEDULED,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationInMinutes: {
      type: Number,
      required: true,
      min: 15,
    },
    location: {
      type: String,
      trim: true,
    },
    roomId: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },

    startedAt: Date,
    endedAt: Date,
    recruiterJoinedAt: Date,
    candidateJoinedAt: Date,

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    cancelledReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

InterviewSchema.index({
  candidateId: 1,
  scheduledAt: 1,
});

InterviewSchema.index({
  recruiterId: 1,
  scheduledAt: 1,
});

InterviewSchema.index(
  {
    applicationId: 1,
    round: 1,
  },
  {
    unique: true,
  },
);

InterviewSchema.index({
  status: 1,
  scheduledAt: 1,
});

InterviewSchema.index({
  jobId: 1,
  status: 1,
});

export const InterviewModel = mongoose.model<InterviewDocument>(
  "Interview",
  InterviewSchema,
);
