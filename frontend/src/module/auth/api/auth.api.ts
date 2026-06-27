import api from "@/api/axios";

import type {
  AdminLoginPayload,
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RequestEmailUpdatePayload,
  ResetPasswordPayload,
  SendOtpPayload,
  UpdatePasswordPayload,
  VerifyEmailUpdatePayload,
  VerifyOtpPayload,
} from "../types/auth.types";

import type { GoogleLoginPayload } from "../types/google.types";

function persistSession(data: AuthResponse) {
  const { accessToken, user } = data;

  localStorage.setItem("authToken", accessToken);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userRole", user.role);

  if (user.fullName) {
    localStorage.setItem("userFullName", user.fullName);
  }

  if (user.profileImage) {
    localStorage.setItem("userProfileImage", user.profileImage);
  }
}

export const login = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    "/auth/login",
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const adminLogin = async (
  payload: AdminLoginPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    "/auth/admin/login",
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const googleLogin = async (
  payload: GoogleLoginPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    "/auth/google/login",
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const sendOtp = async (
  payload: SendOtpPayload,
): Promise<void> => {
  await api.post("/auth/send-otp", payload);
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    "/auth/verify-otp",
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<void> => {
  await api.post("/auth/forgot-password", payload);
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<void> => {
  await api.post("/auth/reset-password", payload);
};

export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<void> => {
  await api.put("/auth/update-password", payload);
};

export const requestEmailUpdate = async (
  payload: RequestEmailUpdatePayload,
): Promise<void> => {
  await api.post("/auth/email/request-otp", payload);
};

export const verifyEmailUpdate = async (
  payload: VerifyEmailUpdatePayload,
): Promise<void> => {
  await api.post("/auth/email/verify-otp", payload);
};

export const uploadProfileImage = async (
  file: File,
): Promise<void> => {
  const formData = new FormData();

  formData.append("profileImage", file);

  await api.patch("/auth/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userProfileImage");
  }
};