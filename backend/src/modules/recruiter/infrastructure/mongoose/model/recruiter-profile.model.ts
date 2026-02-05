import { Schema, Types, model } from "mongoose";


const recruiterProfileSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      trim : true,

    },
    companyWebsite: {
      type: String,
    },
    companySize: {
      type: Number,
    },
    industry: {
      type: String,
    },
    designation: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
    },

    linkedinUrl  : {
      type : String,
    },
    bio: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: ["free", "active", "expired"],
      default: "free",
    },

    jobPostsUsed: {
      type: Number,
      default: 0,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

export const RecruiterProfileModel = model(
  "RecruiterProfile",
  recruiterProfileSchema
);
