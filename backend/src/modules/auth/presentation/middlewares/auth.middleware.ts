import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ACCESS_TOKEN_SECRET } from "../../../../utils/jwt";

interface JwtPayload {
    userId: string;
    role: "admin" | "recruiter" | "candidate";
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: "admin" | "recruiter" | "candidate";
            };
        }
    }
}


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
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
        code: "NO_TOKEN"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

   
    next();

  } catch (err: any) {
   
    
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Token expired",
        code: "TOKEN_EXPIRED"
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token",
        code: "INVALID_TOKEN"
      });
    }

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "Authentication failed",
      code: "AUTH_FAILED"
    });
  }
};
