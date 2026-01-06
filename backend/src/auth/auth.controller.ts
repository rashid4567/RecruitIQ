import { Request, Response } from "express";
import { CookieOptions } from "express";
import { RegisterUser, LoginUser, verifyOTPAndRegister } from "./auth.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { getError } from "../utils/getErrorMessage";
import { verifyRefreshToken, signAccessToken } from "../utils/jwt";
import { createOTPforEmail } from "../otp/otp.service";
import { findUserByEmail } from "./auth.repo";

// Helper function for cookie options
const getCookieOptions = (): CookieOptions => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
    };
};

export const sendRegistrationOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Email is required",
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

        await createOTPforEmail(normalizedEmail);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (err) {
        console.error("❌ Send OTP error:", err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: getError(err),
        });
    }
};

export const verifyCandidateRegistration = async (req: Request, res: Response) => {
    try {
        const { email, otp, password, fullName } = req.body;

        if (!email || !otp || !password || !fullName) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "All fields are required",
            });
        }

        const data = await verifyOTPAndRegister(
            email.toLowerCase().trim(),
            otp,
            password,
            fullName
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
        console.error("❌ Verify registration error:", err);
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: getError(err),
        });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;

        if (role !== "recruiter") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "This endpoint is only for recruiter registration. Candidates must verify email first.",
            });
        }

        const data = await RegisterUser(req.body);

        res.cookie("refreshToken", data.refreshToken, getCookieOptions());

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: {
                accessToken: data.accessToken,
                user: data.user,
            },
        });
    } catch (err) {
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
        console.error("❌ Login error:", err);
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: getError(err),
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
                code: "NO_REFRESH_TOKEN"
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
    } catch (error: any) {
        console.error("❌ Refresh token error:", error.message);
   
        res.clearCookie("refreshToken", {
            path: "/",
        });

        res.status(401).json({
            success: false,
            message: "Invalid refresh token",
            code: "INVALID_REFRESH_TOKEN"
        });
    }
};


export const testCookies = (req: Request, res: Response) => {
    
    res.json({
        success: true,
        cookies: req.cookies,
        hasRefreshToken: !!req.cookies?.refreshToken,
        headers: {
            cookie: req.headers.cookie,
            authorization: req.headers.authorization
        }
    });
};