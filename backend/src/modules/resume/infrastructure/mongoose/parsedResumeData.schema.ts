import { Schema } from "mongoose";

export const parsedResumeDataSchema = new Schema(
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
    linkedin: {
      type: String,
      default: null,
    },
    github: {
      type: String,
      default: null,
    },
    portfolio: {
      type: String,
      default: null,
    },
    currentCompany: {
      type: String,
      default: null,
    },
    currentRole: {
      type: String,
      default: null,
    },
  },
  {
    _id: false,
  },
);