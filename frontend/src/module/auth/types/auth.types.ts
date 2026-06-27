import type React from "react";
import type { GoogleRole } from "./google.types";

export const USER_ROLES = {
  CANDIDATE: "candidate",
  RECRUITER: "recruiter",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface AuthUser {
  id: string;
  role: UserRole;
  fullName?: string;
  profileImage?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface SendOtpPayload {
  email: string;
  role: UserRole;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface RequestEmailUpdatePayload {
  newEmail: string;
}

export interface VerifyEmailUpdatePayload {
  newEmail: string;
  otp: string;
}

export interface UploadProfileImagePayload {
  file: File;
}

export interface RoleOption {
  id: UserRole;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: GoogleRole;
  termsAccepted: boolean;
}

export interface PasswordRequirement {
  label: string;
  met: boolean;
}
