import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { TokenService } from "../../infrastructure/service/token.service";

const tokenService = new TokenService();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Access token missing",
        code: "NO_TOKEN",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = tokenService.verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role as "admin" | "recruiter" | "candidate",
    };

    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Authentication failed",
      code: "AUTH_FAILED",
    });
  }
};
