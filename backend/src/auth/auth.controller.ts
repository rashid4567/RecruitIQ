import { Request, Response } from "express";
import { CookieOptions } from "express";
import { LoginUser, verifyOTPAndRegister } from "./auth.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { getError } from "../utils/getErrorMessage";
import { verifyRefreshToken, signAccessToken } from "../utils/jwt";
import { createOTPforEmail } from "../otp/otp.service";
import { findUserByEmail } from "./auth.repo";

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

export const sendRegistrationOTP = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Email and role are required",
      });
    }

    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid role",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    await createOTPforEmail(normalizedEmail, role);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: getError(err),
    });
  }
};

export const verifyRegistration = async (req: Request, res: Response) => {
  try {
    const { email, otp, password, fullName, role } = req.body;
    
    console.log("📝 Registration Request:", {
      email,
      role,
      hasOtp: !!otp,
      hasPassword: !!password,
      hasFullName: !!fullName
    });


    if (!email || !otp || !password || !fullName || !role) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Email, OTP, password, full name, and role are required",
      });
    }



    const data = await verifyOTPAndRegister(
      email.toLowerCase().trim(),
      otp,
      password,
      fullName,
      role,
 
    );

    res.cookie("refreshToken", data.refreshToken, getCookieOptions());

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Registration completed successfully",
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: getError(err),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await LoginUser(email, password);

    res.cookie("refreshToken", data.refreshToken, getCookieOptions());

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  } catch (err) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: getError(err),
    });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await LoginUser(email, password, "admin");

    res.cookie("refreshToken", data.refreshToken, getCookieOptions());

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Admin login successful",
      data: {
        accessToken: data.accessToken,
        admin: data.user,
      },
    });
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: getError(error),
    });
  }
};



export const refreshToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const decoded = verifyRefreshToken(token);

    const newAccessToken = signAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch {
    res.clearCookie("refreshToken", { path: "/" });

    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};


export const testCookies = (req: Request, res: Response) => {
  res.json({
    success: true,
    cookies: req.cookies,
    hasRefreshToken: !!req.cookies?.refreshToken,
  });
};