import { Schema, model } from "mongoose";

export type UserRole = "admin" | "recruiter" | "candidate";
export type AuthProvider = "local" | "google";

const userSchema = new Schema(
  {
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
      required: function () {
        return this.authProvider === "local";
      },
    },

    
    googleId: {
      type: String,
      index: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
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

  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
