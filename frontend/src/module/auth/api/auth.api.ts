import api from "@/api/axios";
import { AUTH_ROUTES } from "../constant/auth.routes";
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

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    AUTH_ROUTES.LOGIN,
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const adminLogin = async (
  payload: AdminLoginPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    AUTH_ROUTES.ADMIN_LOGIN,
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const googleLogin = async (
  payload: GoogleLoginPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    AUTH_ROUTES.GOOGLE_LOGIN,
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const sendOtp = async (payload: SendOtpPayload): Promise<void> => {
  await api.post(AUTH_ROUTES.SEND_OTP, payload);
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    AUTH_ROUTES.VERIFY_OTP,
    payload,
  );

  persistSession(data.data);

  return data.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<void> => {
  await api.post(AUTH_ROUTES.FORGOT_PASSWORD, payload);
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<void> => {
  await api.post(AUTH_ROUTES.RESET_PASSWORD, payload);
};

export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<void> => {
  await api.put(AUTH_ROUTES.UPDATE_PASSWORD, payload);
};

export const requestEmailUpdate = async (
  payload: RequestEmailUpdatePayload,
): Promise<void> => {
  await api.post(AUTH_ROUTES.REQUEST_EMAIL_UPDATE, payload);
};

export const verifyEmailUpdate = async (
  payload: VerifyEmailUpdatePayload,
): Promise<void> => {
  await api.post(AUTH_ROUTES.VERIFY_EMAIL_UPDATE, payload);
};

export const uploadProfileImage = async (file: File): Promise<void> => {
  const formData = new FormData();

  formData.append("profileImage", file);

  await api.patch(AUTH_ROUTES.UPLOAD_PROFILE_IMAGE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(AUTH_ROUTES.LOGOUT);
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userProfileImage");
  }
};
