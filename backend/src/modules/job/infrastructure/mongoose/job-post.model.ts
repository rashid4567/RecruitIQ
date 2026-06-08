import mongoose, { Schema, Document } from "mongoose";

export interface JobPostDocument extends Document {
  recruiterId: mongoose.Types.ObjectId;
  companyName : string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
  isRemote: boolean;
  jobType: "full-time" | "part-time" | "contract" | "internship";
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  department: string;
  positions: number;
  visibility: "active" | "hidden";
  isBlocked: boolean;
  isDeleted: boolean;
  status: "draft" | "active" | "expired";
  postedOn?: Date;
  expiresAt?: Date;
  externalLink?: string;
  views: number;
  publicationCount: number;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobPostSchema = new Schema<JobPostDocument>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    companyName : {
      type : String,
      required : true,
      trim : true,
      maxLength : 100,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    preferredSkills: {
      type: [String],
      default: [],
    },

    experienceMin: {
      type: Number,
      required: true,
      min: 0,
    },

    experienceMax: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    isRemote: {
      type: Boolean,
      default: false,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },

    salary: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: "INR" },
    },

    department: {
      type: String,
      trim: true,
    },

    positions: {
      type: Number,
      default: 1,
      min: 1,
    },

    visibility: {
      type: String,
      enum: ["active", "hidden"],
      default: "active",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "active", "expired"],
      default: "draft",
    },

    postedOn: Date,
    expiresAt: Date,

    externalLink: String,

    views: {
      type: Number,
      default: 0,
    },

    publicationCount: {
      type: Number,
      default: 0,
    },

    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

JobPostSchema.index({
  recruiterId: 1,
  status: 1,
  isDeleted: 1,
  createdAt: -1,
});

JobPostSchema.index({
  isBlocked: 1,
  isDeleted: 1,
  status: 1,
  visibility: 1,
  createdAt: -1,
});

JobPostSchema.index({ expiresAt: 1 });
JobPostSchema.index({
  title: "text",
  description: "text",
  requiredSkills: "text",
});
JobPostSchema.index({ "location.city": 1 });
JobPostSchema.index({ requiredSkills: 1 });
JobPostSchema.index(
  { createdAt: -1 },
  {
    partialFilterExpression: {
      isDeleted: false,
      isBlocked: false,
      status: "active",
    },
  },
);

export const JobPostModel = mongoose.model<JobPostDocument>(
  "JobPost",
  JobPostSchema,
);
