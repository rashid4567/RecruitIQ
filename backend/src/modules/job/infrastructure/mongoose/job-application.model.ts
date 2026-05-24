import mongoose, { Schema, Document } from "mongoose";
export interface JobApplicationDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  coverLetter?: string;
  status:
    | "APPLIED"
    | "SHORTLISTED"
    | "INTERVIEW_SCHEDULED"
    | "SELECTED"
    | "REJECTED"
    | "WITHDRAWN";

  interview?: {
    scheduledAt: Date;
    location?: string;
    meetingLink?: string;
    notes?: string;
  };
  rejectionReason?: string;
  appliedAt: Date;
  updatedAt: Date;
}

const schema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "APPLIED",
        "SHORTLISTED",
        "INTERVIEW_SCHEDULED",
        "SELECTED",
        "REJECTED",
        "WITHDRAWN",
      ],
      default: "APPLIED",
    },

    interview: {
      scheduledAt: Date,
      location: String,
      meetingLink: String,
      notes: String,
    },
    rejectionReason: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

schema.index(
  {
    candidateId: 1,
    jobId: 1,
  },
  {
    unique: true,
  },
);
export const JobApplicationModel = mongoose.model("JobApplication", schema);
