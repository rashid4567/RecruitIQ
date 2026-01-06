import { Schema, Types, model } from "mongoose";

const recruiterProfileSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyWebsite: {
    type: String,
  },
  companySize: {
    type: String,
  },
  industry: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  SubscribtionStatus: {
    type: String,
    enum: ["free", "active", "expired"],
    default: "free",
  },
  jobPostUsed: {
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
    timestamps : true,
});

export const RecruiterProfileModel = model("RecruiterProfile",recruiterProfileSchema)
