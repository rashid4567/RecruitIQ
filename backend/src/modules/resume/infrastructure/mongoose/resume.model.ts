import { Schema, model, Types } from "mongoose";

const parsedResumeSchema = new Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },

    experience: {
      type: [String],
      default: [],
    },

    totalExperienceYears: Number,
  },
  {
    _id: false,
  },
);

const resumeSchema = new Schema(
  {
    candidateId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileKey: {
      type: String,
      required: true,
    },

    uploadedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    parsedData: {
      type: parsedResumeSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ResumeModel = model("Resume", resumeSchema);
