import mongoose, { Document, Schema } from "mongoose";

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  SELECTED = "SELECTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum ApplicationAnalysisStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
}


export interface ApplicationAIAnalysis {
  overallScore: number;
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  requirementsScore: number;
  educationScore: number;
  strengths: string[];
  gaps: string[];
  missingCriticalSkills: string[];
  recommendation:
    | "STRONG_MATCH"
    | "GOOD_MATCH"
    | "PARTIAL_MATCH"
    | "POOR_MATCH";
  summary: string;
  analyzedAt: Date;
}

export interface JobApplicationDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  coverLetter?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  analysisStatus: ApplicationAnalysisStatus;
  aiAnalysis?: ApplicationAIAnalysis;
  isDeleted: boolean;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
const AIAnalysisSchema = new Schema<ApplicationAIAnalysis>(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    requiredSkillsScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    preferredSkillsScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    experienceScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    requirementsScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    educationScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    strengths: {
      type: [String],
      default: [],
    },

    gaps: {
      type: [String],
      default: [],
    },

    missingCriticalSkills: {
      type: [String],
      default: [],
    },

    recommendation: {
      type: String,
      enum: ["STRONG_MATCH", "GOOD_MATCH", "PARTIAL_MATCH", "POOR_MATCH"],
    },

    summary: {
      type: String,
      maxlength: 2000,
    },

    analyzedAt: {
      type: Date,
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

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    analysisStatus: {
      type: String,
      enum: Object.values(ApplicationAnalysisStatus),
      default: ApplicationAnalysisStatus.PENDING,
      required: true,
    },
    aiAnalysis: {
      type: AIAnalysisSchema,
      required: false,
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
  jobId: 1,
  "aiAnalysis.overallScore": -1,
});

JobApplicationSchema.index({
  isDeleted: 1,
  status: 1,
});

export const JobApplicationModel = mongoose.model<JobApplicationDocument>(
  "JobApplication",
  JobApplicationSchema,
);
