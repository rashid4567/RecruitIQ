import { Schema, model, Types } from "mongoose";
import { parsedResumeDataSchema } from "./parsedResumeData.schema";



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
      parseStatus: {
        type: String,
        enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
        default: "PENDING",
        required: true,
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
