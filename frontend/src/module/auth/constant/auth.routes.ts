export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  ADMIN_LOGIN: "/auth/admin/login",
  GOOGLE_LOGIN: "/auth/google/login",
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  UPDATE_PASSWORD: "/auth/update-password",
  REQUEST_EMAIL_UPDATE: "/auth/email/request-otp",
  VERIFY_EMAIL_UPDATE: "/auth/email/verify-otp",
  UPLOAD_PROFILE_IMAGE: "/auth/profile-image",
  LOGOUT: "/auth/logout",
} as const;