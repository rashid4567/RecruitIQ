import { Schema, model, Types } from "mongoose";

const parsedResumeDataSchema = new Schema(
  {
    fullName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
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
    totalExperienceYears: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
  },
);

export const ResumeModel = model(
  "Resume",
  new Schema(
    {
      candidateId: {
        type: Types.ObjectId,
        required: true,
        ref: "CandidateProfile",
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
        type: parsedResumeDataSchema,
        required: false,
      },
    },
    {
      timestamps: true,
    },
  ),
);