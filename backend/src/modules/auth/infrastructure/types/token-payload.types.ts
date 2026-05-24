export type AccessTokenPayload = {
  userId: string;
  role: string;
};

export type RefreshTokenPayload = {
  userId: string;
};

export type PasswordResetTokenPayload = {
  userId: string;
  purpose: "PASSWORD_RESET";
};
