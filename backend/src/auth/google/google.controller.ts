import { Request, Response } from "express";
import { CookieOptions } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { getError } from "../../utils/getErrorMessage";
import { googleLoginService } from "./google.service";

const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Credential is required",
      });
    }
    if (role && !["candidate", "recruiter"].includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid role. Must be 'candidate' or 'recruiter'",
      });
    } 
    const data = await googleLoginService(credential, role);

    res.cookie("refreshToken", data.refreshToken, getCookieOptions());

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Google authentication successful",
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: getError(err),
    });
  }
};
