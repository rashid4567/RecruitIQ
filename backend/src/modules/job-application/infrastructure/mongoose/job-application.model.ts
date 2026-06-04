import mongoose, { Document, Schema } from "mongoose";

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  SELECTED = "SELECTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export interface InterviewDetails {
  scheduledAt: Date;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export interface JobApplicationDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  coverLetter?: string;
  status: ApplicationStatus;
  interview?: InterviewDetails;
  rejectionReason?: string;
  isDeleted: boolean;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<InterviewDetails>(
  {
    scheduledAt: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const JobApplicationSchema = new Schema<JobApplicationDocument>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
      index: true,
    },

    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    coverLetter: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
      required: true,
    },

    interview: {
      type: InterviewSchema,
      required: false,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


JobApplicationSchema.index(
  {
    candidateId: 1,
    jobId: 1,
  },
  {
    unique: true,
  },
);


JobApplicationSchema.index({
  recruiterId: 1,
  status: 1,
  appliedAt: -1,
});


JobApplicationSchema.index({
  jobId: 1,
  status: 1,
  appliedAt: -1,
});

JobApplicationSchema.index({
  candidateId: 1,
  status: 1,
  appliedAt: -1,
});

JobApplicationSchema.index({
  status: 1,
  "interview.scheduledAt": 1,
});


JobApplicationSchema.index({
  isDeleted: 1,
  status: 1,
});

export const JobApplicationModel =
  mongoose.model<JobApplicationDocument>(
    "JobApplication",
    JobApplicationSchema,
  );