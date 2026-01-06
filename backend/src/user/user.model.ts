import { Schema, model, Types } from "mongoose";

export type UserRole = "admin" | "recruiter" | "candidate";

const userSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "recruiter", "candidate"],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = model("User", userSchema);
