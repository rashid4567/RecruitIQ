export const TOKEN_EXPIRY = {
  ACCESS: "15m",
  REFRESH: "7d",
  PASSWORD_RESET: "10m",
} as const;

export const TOKEN_PURPOSE = {
  ACCESS: "ACCESS",
  REFRESH: "REFRESH",
  PASSWORD_RESET: "PASSWORD_RESET",
} as const;
