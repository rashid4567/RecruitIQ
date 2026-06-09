import { Response, CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const setRefreshCookie = (
  res: Response,
  refreshToken: string,
): void => {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

export const clearRefreshCookie = (
  res: Response,
): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};